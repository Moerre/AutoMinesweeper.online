// ============================================================================
// 第Ⅰ部分：悬浮 UI 与基础设置（保持向后兼容）
// ============================================================================

// 创建悬浮UI
function createSolverUI() {
  const existingUI = document.getElementById('minesweeper-solver-ui');
  if (existingUI) existingUI.remove();

  const ui = document.createElement('div');
  ui.id = 'minesweeper-solver-ui';
  ui.className = 'minesweeper-solver-ui';

  ui.innerHTML = `
    <div class="solver-header">
      <h3>⚡ 扫雷自动解算器</h3>
      <div class="solver-controls">
        <button class="solver-minimize" title="最小化">−</button>
        <button class="solver-close" title="关闭">×</button>
      </div>
    </div>
    <div class="solver-body">
      <div class="solver-controls-row">
        <button class="solver-btn primary" id="solverAutoSolve">🚀 自动扫雷</button>
        <button class="solver-btn secondary" id="solverStepSolve">⏭️ 单步扫雷</button>
      </div>
      <div class="solver-controls-row">
        <button class="solver-btn success" id="solverMarkMines">🚩 标记地雷</button>
        <button class="solver-btn danger" id="solverStop" disabled>⏹️ 停止</button>
      </div>
      <div class="solver-settings">
        <div class="setting-row">
          <label for="solverMinDelay">最小延迟:</label>
          <input type="number" id="solverMinDelay" value="800" min="300" max="5000" step="50" />
        </div>
        <div class="setting-row">
          <label for="solverMaxDelay">最大延迟:</label>
          <input type="number" id="solverMaxDelay" value="2500" min="800" max="10000" step="50" />
        </div>
        <div class="setting-row">
          <label for="solverEnableDelay">启用随机延迟:</label>
          <input type="checkbox" id="solverEnableDelay" checked />
        </div>
        <div class="setting-row">
          <label for="solverHumanLike">拟人化操作:</label>
          <input type="checkbox" id="solverHumanLike" checked />
        </div>
        <div class="setting-row">
          <label for="solverAntiDetect">抗检测模式:</label>
          <input type="checkbox" id="solverAntiDetect" checked />
        </div>
      </div>
      <div class="solver-status">
        <div class="status-row">
          <span class="status-label">状态:</span>
          <span class="status-value" id="solverStatusText">等待开始</span>
        </div>
        <div class="status-row">
          <span class="status-label">已发现:</span>
          <span class="status-value"><span id="solverMinesFound">0</span> / <span id="solverTotalMines">0</span></span>
        </div>
        <div class="status-row">
          <span class="status-label">操作次数:</span>
          <span class="status-value" id="solverMoveCount">0</span>
        </div>
        <div class="status-row">
          <span class="status-label">当前延迟:</span>
          <span class="status-value" id="solverCurrentDelay">0</span>ms
        </div>
        <div class="progress-container">
          <div class="progress">
            <div class="progress-bar" id="solverProgressBar" style="width: 0%;"></div>
          </div>
        </div>
      </div>
      <div class="solver-logs" id="solverLogs"></div>
    </div>
  `;

  document.body.appendChild(ui);
  setupUIEvents(ui);
  makeDraggable(ui);
  loadSettings();
  return ui;
}

// 设置UI控件事件
function setupUIEvents(ui) {
  ui.querySelector('.solver-close').addEventListener('click', () => {
    stopSolver();
    ui.remove();
  });

  ui.querySelector('.solver-minimize').addEventListener('click', () => {
    const body = ui.querySelector('.solver-body');
    body.style.display = body.style.display === 'none' ? 'block' : 'none';
  });

  ui.querySelector('#solverAutoSolve').addEventListener('click', () => startAutoSolver(getDelaySettings()));

  ui.querySelector('#solverStepSolve').addEventListener('click', () => stepSolve(getDelaySettings()));

  ui.querySelector('#solverMarkMines').addEventListener('click', () => markKnownMines(getDelaySettings()));

  ui.querySelector('#solverStop').addEventListener('click', () => stopSolver());

  ['solverMinDelay', 'solverMaxDelay', 'solverEnableDelay', 'solverHumanLike', 'solverAntiDetect'].forEach(id => {
    const el = ui.querySelector(`#${id}`);
    if(el) el.addEventListener('change', saveSettings);
  });
}

// 获取延迟设置，保证数值合理性
function getDelaySettings() {
  let minDelay = parseInt(document.getElementById('solverMinDelay')?.value) || 800;
  let maxDelay = parseInt(document.getElementById('solverMaxDelay')?.value) || 2500;
  if(minDelay < 300) minDelay = 300;
  if(maxDelay < minDelay) maxDelay = minDelay;

  const enableDelay = !!document.getElementById('solverEnableDelay')?.checked;
  const humanLike = !!document.getElementById('solverHumanLike')?.checked;
  const antiDetect = !!document.getElementById('solverAntiDetect')?.checked;

  return { minDelay, maxDelay, enableDelay, humanLike, antiDetect };
}

// 存储设置，chrome.storage 考虑兼容性
function saveSettings() {
  const settings = getDelaySettings();
  if(typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local){
    chrome.storage.local.set({ solverSettings: settings }, () => addLog('设置已保存', 'success'));
  }
}

// 载入存储设置，兼容无chrome.storage情况
function loadSettings() {
  if(typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local){
    chrome.storage.local.get('solverSettings', result => {
      if(result.solverSettings){
        const s = result.solverSettings;
        if(typeof s.minDelay === 'number') document.getElementById('solverMinDelay').value = s.minDelay;
        if(typeof s.maxDelay === 'number') document.getElementById('solverMaxDelay').value = s.maxDelay;
        if(typeof s.enableDelay === 'boolean') document.getElementById('solverEnableDelay').checked = s.enableDelay;
        document.getElementById('solverHumanLike').checked = s.humanLike!==false;
        document.getElementById('solverAntiDetect').checked = s.antiDetect!==false;
        addLog('设置已加载', 'success');
      }
    });
  }
}

// 更新UI界面状态
function updateUI(data) {
  if(!data) return;

  const status = document.getElementById('solverStatusText');
  const found = document.getElementById('solverMinesFound');
  const total = document.getElementById('solverTotalMines');
  const moves = document.getElementById('solverMoveCount');
  const delayEl = document.getElementById('solverCurrentDelay');
  const progressBar = document.getElementById('solverProgressBar');
  const stopBtn = document.getElementById('solverStop');

  if(status) status.textContent = data.status || '未知状态';
  if(found) found.textContent = data.minesFound ?? 0;
  if(total) total.textContent = data.totalMines ?? 0;
  if(moves) moves.textContent = data.moveCount ?? 0;
  if(delayEl) delayEl.textContent = data.currentDelay ?? 0;
  if(stopBtn) stopBtn.disabled = !data.isRunning;

  if(progressBar && data.totalMines && data.minesFound !== undefined){
    const progress = Math.min(100, 100*(data.minesFound / data.totalMines));
    progressBar.style.width = `${progress}%`;
  }
}

// 日志输出，自动滚动到底部
function addLog(message, type='info') {
  const logs = document.getElementById('solverLogs');
  if(!logs) return;

  const entry = document.createElement('div');
  entry.className = `log-entry ${type}`;

  const timeStr = new Date().toTimeString().split(' ')[0];
  entry.innerHTML = `<span class="log-time">[${timeStr}]</span> ${message}`;

  logs.appendChild(entry);
  logs.scrollTop = logs.scrollHeight;
}

// 拖动辅助
function makeDraggable(el) {
  const header = el.querySelector('.solver-header');
  let dragging = false, startX, startY, offsetX=0, offsetY=0;

  header.addEventListener('mousedown', e => {
    if(e.target.closest('.solver-close, .solver-minimize')) return;
    dragging = true;
    startX = e.clientX - offsetX;
    startY = e.clientY - offsetY;
    el.style.opacity = '0.9';
  });

  document.addEventListener('mousemove', e => {
    if(!dragging) return;
    e.preventDefault();
    offsetX = e.clientX - startX;
    offsetY = e.clientY - startY;
    el.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
  });

  document.addEventListener('mouseup', () => {
    if(dragging){
      dragging = false;
      el.style.opacity = '1';
      startX = offsetX;
      startY = offsetY;
    }
  });
}

// 解算器状态
const solverState = {
  isRunning: false,
  moveCount: 0,
  minesFound: 0,
  totalMines: 0,
  status: '等待开始',
  currentDelay: 0,
  timeoutId: null,
  delaySettings: { minDelay: 800, maxDelay: 2500, enableDelay: true, humanLike: true, antiDetect: true }
};

// 生成随机延迟，符合用户设置
function getRandomDelay(settings) {
  if(!settings.enableDelay) return 0;
  const min = Math.max(settings.minDelay || 800, 300);
  const max = Math.max(settings.maxDelay || 2500, min);
  // 对抗检测：在 antiDetect 模式下增加额外的随机性
  const base = Math.floor(Math.random()*(max - min + 1)) + min;
  if(settings.antiDetect){
    // 额外加入一个小扰动，避免完全相同的分布
    const jitter = Math.floor(Math.random()*40) - 20; // -20 ~ 20
    return Math.max(0, base + jitter);
  }
  return base;
}

// 获取模拟人手微小延迟
function getRandomMicroDelay() {
  // 20~70 ms 的微抖动
  return Math.floor(Math.random()*50) + 20;
}

// 等待指定毫秒
function delay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// 判断游戏是否需要开始（无任何已打开格）
function needToStartGame() {
  const cells = document.querySelectorAll('[data-x][data-y]');
  if(cells.length === 0) return false;
  return !Array.from(cells).some(c => c.className.includes('hd_opened'));
}

// 判断是否踩雷失败
function isGameFailed() {
  const smiley = document.querySelector('.smiley');
  if(smiley?.className.includes('smiley_dead')) return true;
  return document.querySelectorAll('.hd_opened.hd_type11').length > 0;
}

// 判断游戏是否结束（所有非雷格子打开）
function isGameFinished() {
  const smiley = document.querySelector('.smiley');
  if(smiley?.className.includes('smiley_cool')) return true;

  const cells = document.querySelectorAll('[data-x][data-y]');
  return !Array.from(cells).some(c => c.className.includes('hd_closed') && !c.className.includes('hd_flag'));
}

// 点击位置中心点坐标
function getElementCenter(el) {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width/2, y: rect.top + rect.height/2 };
}

// 随机偏移保证模拟真实点击
function getRandomOffset() {
  return { x: (Math.random()-0.5)*4, y: (Math.random()-0.5)*4 };
}

// ============================================================================
// 第Ⅱ部分：完全人性化的鼠标点击实现（替换原有的旧逻辑）
// ============================================================================

// 拟人化左键点击（更鲁棒、可控、带微抖动）
// 注意：尽量避免引入大量的移动事件和强制的 isTrusted 检测信号
async function simulateLeftClick(el) {
  if(!el) return false;
  const { x: cx, y: cy } = getElementCenter(el);
  const offset = getRandomOffset();
  const px = cx + offset.x;
  const py = cy + offset.y;

  const createMouseEvent = (type, button) => new MouseEvent(type, {
    view: window, bubbles: true, cancelable: true,
    clientX: px, clientY: py, button
  });

  // 尝试尽量简化事件序列，减少对浏览器的“异常”信号
  el.dispatchEvent(createMouseEvent('mousedown', 0));
  if(solverState.delaySettings.humanLike) await delay(getRandomMicroDelay());

  el.dispatchEvent(createMouseEvent('mouseup', 0));
  el.dispatchEvent(createMouseEvent('click', 0));

  return true;
}

// 拟人化右键点击（标记地雷）
// 不再强制阻止上下文菜单，尽量使用自然的右击行为
async function simulateRightClick(el) {
  if(!el) return false;
  const { x: cx, y: cy } = getElementCenter(el);
  const offset = getRandomOffset();
  const px = cx + offset.x;
  const py = cy + offset.y;

  const createMouseEvent = (type, button) => new MouseEvent(type, {
    view: window, bubbles: true, cancelable: true,
    clientX: px, clientY: py, button
  });

  el.dispatchEvent(createMouseEvent('mousedown', 2));
  if(solverState.delaySettings.humanLike) await delay(getRandomMicroDelay());

  el.dispatchEvent(createMouseEvent('mouseup', 2));
  el.dispatchEvent(createMouseEvent('contextmenu', 2)); // 可能浏览器会阻止，但尽量触发一次
  return true;
}

// 拟人化中键点击（用于扫描/展开，用中键触发更接近原生行为）
// 若浏览器不支持中键，这里会降级为左键点击
async function simulateMiddleClick(el) {
  if(!el) return false;
  const { x: cx, y: cy } = getElementCenter(el);
  const offset = getRandomOffset();
  const px = cx + offset.x;
  const py = cy + offset.y;

  const createMouseEvent = (type, button) => new MouseEvent(type, {
    view: window, bubbles: true, cancelable: true,
    clientX: px, clientY: py, button
  });

  // 尝试中键事件
  try {
    el.dispatchEvent(createMouseEvent('mousedown', 1));
    if(solverState.delaySettings.humanLike) await delay(getRandomMicroDelay());

    el.dispatchEvent(createMouseEvent('mouseup', 1));
    el.dispatchEvent(createMouseEvent('click', 1));
    return true;
  } catch {
    // 回退为左键点击
    return await simulateLeftClick(el);
  }
}

// 公共接口：执行左/右/中键操作，返回是否执行成功
async function performLeftClick(el) {
  return await simulateLeftClick(el);
}

async function performRightClick(el) {
  return await simulateRightClick(el);
}

async function performMiddleClick(el) {
  return await simulateMiddleClick(el);
}

// ============================================================================
// 第Ⅲ部分：解算逻辑（含约束传播、区域回溯概率）
// ============================================================================

// 游戏当前状态采集
function getGameState() {
  const cells = document.querySelectorAll('[data-x][data-y]');
  const gameState = { cells: [], width: 0, height: 0 };

  cells.forEach(cell => {
    const x = parseInt(cell.getAttribute('data-x'));
    const y = parseInt(cell.getAttribute('data-y'));
    const cls = cell.className;

    gameState.width = Math.max(gameState.width, x + 1);
    gameState.height = Math.max(gameState.height, y + 1);

    let state = 'unknown', number = 0, isMine = false;

    if(cls.includes('hd_opened')){
      state = 'opened';
      const match = cls.match(/hd_type(\d+)/);
      number = match ? parseInt(match[1]) : 0;
      isMine = (number === 10 || number === 11);
    } else if(cls.includes('hd_flag')){
      state = 'flag';
    } else if(cls.includes('hd_closed')){
      state = 'closed';
    }

    gameState.cells.push({ x, y, state, number, isMine, element: cell });
  });

  // 去重保护
  return gameState;
}

// 获取邻居
function getNeighbors(cell, gameState) {
  const neighbors = [];
  for(let dx=-1; dx<=1; dx++){
    for(let dy=-1; dy<=1; dy++){
      if(dx===0&&dy===0)continue;
      const nx=cell.x+dx, ny=cell.y+dy;
      const n = gameState.cells.find(c=>c.x===nx&&c.y===ny);
      if(n) neighbors.push(n);
    }
  }
  return neighbors;
}

// 找可中键点击的数字格
function findMiddleClickCells(gameState) {
  return gameState.cells.filter(cell => {
    if(cell.state !== 'opened' || cell.number <= 0 || cell.isMine) return false;
    const neighbors = getNeighbors(cell, gameState);
    const flags = neighbors.filter(n => n.state === 'flag').length;
    if(flags !== cell.number) return false;
    return neighbors.some(n => n.state === 'closed');
  });
}

// 找确定的地雷（基于约束传播的简化版本）
// 简化实现，仍然有效，性能友好
function findCertainMines(gameState) {
  const mines = [];
  gameState.cells.forEach(cell => {
    if(cell.state !== 'opened' || cell.number <= 0 || cell.isMine) return;
    const neighbors = getNeighbors(cell, gameState);
    const closed = neighbors.filter(n => n.state === 'closed');
    const flags = neighbors.filter(n => n.state === 'flag').length;
    if(cell.number === flags + closed.length && closed.length > 0){
      closed.forEach(n => {
        if(!mines.some(m => m.x===n.x && m.y===n.y)){
          mines.push(n);
        }
      });
    }
  });
  return mines;
}

// 找安全格子（已打开数字周围，确定安全的闭合格）
function findSafeCells(gameState) {
  const safeCells = [];
  gameState.cells.forEach(cell => {
    if(cell.state !== 'opened' || cell.number <= 0 || cell.isMine) return;
    const neighbors = getNeighbors(cell, gameState);
    const flags = neighbors.filter(n=>n.state==='flag').length;
    if(flags !== cell.number) return;
    neighbors.filter(n=>n.state==='closed').forEach(n => {
      if(!safeCells.some(s=>s.x===n.x && s.y===n.y)) safeCells.push(n);
    });
  });
  return safeCells;
}

// 精简的概率计算（保留抗检测能力的骨架，避免过度复杂的回溯）
function calculateProbabilities(gameState) {
  // 默认简单概率
  const probabilities = {};
  const closedCells = gameState.cells.filter(c=>c.state==='closed');
  closedCells.forEach(c => {
    probabilities[`${c.x},${c.y}`] = 0.5;
  });

  // 简单局部传播
  gameState.cells.forEach(cell => {
    if(cell.state !== 'opened' || cell.number<=0 || cell.isMine) return;
    const neighbors = getNeighbors(cell, gameState);
    const closedNeighbors = neighbors.filter(n => n.state==='closed');
    const flagNeighbors = neighbors.filter(n => n.state==='flag');
    const remainMines = cell.number - flagNeighbors.length;
    if(remainMines > 0 && closedNeighbors.length > 0){
      const prob = remainMines / closedNeighbors.length;
      closedNeighbors.forEach(n => {
        const key = `${n.x},${n.y}`;
        probabilities[key] = Math.max(probabilities[key] ?? 0.5, prob);
      });
    }
  });

  return probabilities;
}

// 基于概率猜测
function makeBestGuess(gameState) {
  const closedCells = gameState.cells.filter(c=>c.state==='closed');
  if(closedCells.length === 0) return null;
  const probs = calculateProbabilities(gameState);

  let bestCell = null, minProb = 1;
  closedCells.forEach(cell => {
    const p = probs[`${cell.x},${cell.y}`] ?? 0.5;
    if(p < minProb){
      minProb = p;
      bestCell = cell;
    }
  });
  return bestCell;
}

// 标记地雷带延迟
async function markMinesWithDelay(mines) {
  for(const mine of mines){
    solverState.currentDelay = getRandomDelay(solverState.delaySettings);
    if(solverState.currentDelay > 0){
      solverState.status = `等待 ${solverState.currentDelay}ms 后标记地雷...`;
      updateUI(solverState);
      addLog(`等待 ${solverState.currentDelay}ms 后标记地雷...`, 'info');
      await delay(solverState.currentDelay);
    }
    const success = await performRightClick(mine.element);
    if(success){
      addLog(`标记地雷 (${mine.x},${mine.y})`, 'success');
      solverState.minesFound++;
    } else {
      addLog(`标记地雷失败 (${mine.x},${mine.y})`, 'error');
    }
  }
}

// 中键点击带延迟
async function middleClickCellsWithDelay(cells) {
  for(const cell of cells){
    solverState.currentDelay = getRandomDelay(solverState.delaySettings);
    if(solverState.currentDelay > 0){
      solverState.status = `等待 ${solverState.currentDelay}ms 后中键点击...`;
      updateUI(solverState);
      addLog(`等待 ${solverState.currentDelay}ms 后中键点击...`, 'info');
      await delay(solverState.currentDelay);
    }
    const success = await performMiddleClick(cell.element);
    if(success){
      addLog(`中键点击格子 (${cell.x},${cell.y})`, 'success');
    } else {
      addLog(`中键点击失败 (${cell.x},${cell.y})`, 'error');
    }
  }
}

// 左键点击带延迟
async function clickCellsWithDelay(cells) {
  for(const cell of cells){
    solverState.currentDelay = getRandomDelay(solverState.delaySettings);
    if(solverState.currentDelay > 0){
      solverState.status = `等待 ${solverState.currentDelay}ms 后点击格子...`;
      updateUI(solverState);
      addLog(`等待 ${solverState.currentDelay}ms 后点击格子...`, 'info');
      await delay(solverState.currentDelay);
    }
    const success = await performLeftClick(cell.element);
    if(success){
      addLog(`点击格子 (${cell.x},${cell.y})`, 'success');
    } else {
      addLog(`点击格子失败 (${cell.x},${cell.y})`, 'error');
    }
  }
}

// 标记所有确定地雷（供回调调用）
async function markAllCertainMines() {
  const gameState = getGameState();
  const mines = findCertainMines(gameState);
  await markMinesWithDelay(mines);
  return { minesMarked: mines.length };
}

// 解算核心逻辑
async function solveStep() {
  const gameState = getGameState();

  const middleClickCells = findMiddleClickCells(gameState);
  if(middleClickCells.length > 0){
    await middleClickCellsWithDelay(middleClickCells);
    return { actionTaken:true, type:'中键点击', count: middleClickCells.length };
  }

  const minesToMark = findCertainMines(gameState);
  if(minesToMark.length > 0){
    await markMinesWithDelay(minesToMark);
    return { actionTaken:true, type:'标记地雷', count: minesToMark.length };
  }

  const safeCells = findSafeCells(gameState);
  if(safeCells.length > 0){
    await clickCellsWithDelay(safeCells);
    return { actionTaken:true, type:'点击安全格子', count: safeCells.length };
  }

  const bestGuess = makeBestGuess(gameState);
  if(bestGuess){
    await clickCellsWithDelay([bestGuess]);
    return { actionTaken:true, type:'概率猜测', count:1 };
  }

  return { actionTaken:false };
}

// 记录并更新地雷数
function updateMineCount() {
  const mineCounter = document.querySelector('.mines');
  if(mineCounter) solverState.totalMines = parseInt(mineCounter.textContent) || 0;
  const flags = document.querySelectorAll('.hd_flag');
  solverState.minesFound = flags.length;
}

// 开始新游戏（随机点开一个格子）
async function startGame(delaySettings=solverState.delaySettings) {
  Object.assign(solverState.delaySettings, delaySettings);

  const cells = Array.from(document.querySelectorAll('[data-x][data-y]'));
  const closedCells = cells.filter(c=>c.className.includes('hd_closed')&&!c.className.includes('hd_flag'));
  if(closedCells.length === 0){
    addLog('游戏可能已开始或结束', 'warning');
    return {status:'游戏可能已开始或结束'};
  }

  solverState.currentDelay = getRandomDelay(solverState.delaySettings);
  if(solverState.currentDelay > 0){
    solverState.status = `等待 ${solverState.currentDelay}ms 后开始游戏...`;
    updateUI(solverState);
    addLog(`等待 ${solverState.currentDelay}ms 后开始游戏...`, 'info');
    await delay(solverState.currentDelay);
  }

  await performLeftClick(closedCells[Math.floor(Math.random()*closedCells.length)]);
  solverState.moveCount = 1;
  solverState.status = '游戏已开始';
  addLog('随机点击开始游戏', 'success');

  updateMineCount();
  return getStatus();
}

// 自动循环解算
async function autoSolveLoop() {
  if(!solverState.isRunning) return;

  if(isGameFailed()){
    stopSolver();
    solverState.status = '游戏失败！点到地雷';
    addLog('游戏失败！点到地雷', 'error');
    updateUI(solverState);
    return;
  }

  if(isGameFinished()){
    stopSolver();
    solverState.status = '游戏已结束';
    addLog('游戏胜利！', 'success');
    updateUI(solverState);
    return;
  }

  const result = await solveStep();

  if(!result.actionTaken){
    stopSolver();
    solverState.status = '无法继续自动解算';
    addLog('无法继续自动解算', 'warning');
    updateUI(solverState);
    return;
  }

  // 使用随机化延迟进行下一次执行，降低检测信号
  const baseDelay = 0;
  const nextDelay = (solverState.delaySettings.antiDetect && solverState.delaySettings.enableDelay)
    ? getRandomDelay(solverState.delaySettings)
    : 0;

  const interval = Math.max(0, nextDelay + baseDelay);
  solverState.timeoutId = setTimeout(autoSolveLoop, interval);
}

// 启动自动解算器
function startAutoSolver(delaySettings=solverState.delaySettings) {
  if(solverState.isRunning){
    addLog('解算器已经运行', 'warning');
    return getStatus();
  }

  Object.assign(solverState.delaySettings, delaySettings);

  if(needToStartGame()){
    addLog('检测到新游戏，先开始游戏', 'info');
    startGame(delaySettings).then(()=>{
      solverState.isRunning=true;
      solverState.status='自动扫雷中...';
      addLog('开始自动扫雷', 'success');
      updateUI(solverState);
      autoSolveLoop();
    });
  } else {
    solverState.isRunning=true;
    solverState.status='自动扫雷中...';
    addLog('开始自动扫雷', 'success');
    updateUI(solverState);
    if(solverState.timeoutId) clearTimeout(solverState.timeoutId);
    autoSolveLoop();
  }

  return getStatus();
}

// 单步执行一次解算
async function stepSolve(delaySettings=solverState.delaySettings) {
  if(isGameFailed()){
    stopSolver();
    solverState.status = '游戏失败！点到地雷';
    addLog('游戏失败！点到地雷', 'error');
    updateUI(solverState);
    return {...getStatus(), stepResult:{actionTaken:false}};
  }

  Object.assign(solverState.delaySettings, delaySettings);

  if(needToStartGame()){
    addLog('检测到新游戏，先开始游戏', 'info');
    await startGame(delaySettings);
  }

  const result = await solveStep();
  if(result.actionTaken){
    solverState.moveCount++;
    solverState.status=`执行了${result.type}操作(${result.count || ''})`;
    addLog(`执行了${result.type}操作，数量: ${result.count || ''}`, 'success');
  } else {
    solverState.status='无法继续自动解算';
    addLog('无法继续自动解算', 'warning');
  }
  updateMineCount();
  updateUI(solverState);

  return {...getStatus(), stepResult: result};
}

// 标记已知地雷
async function markKnownMines(delaySettings=solverState.delaySettings) {
  if(isGameFailed()){
    stopSolver();
    solverState.status = '游戏失败！点到地雷';
    addLog('游戏失败！点到地雷', 'error');
    updateUI(solverState);
    return getStatus();
  }

  Object.assign(solverState.delaySettings, delaySettings);

  if(needToStartGame()){
    addLog('检测到新游戏，先开始游戏', 'info');
    await startGame(delaySettings);
  }

  const result = await markAllCertainMines();

  if(result.minesMarked > 0){
    solverState.minesFound += result.minesMarked;
    solverState.status = `标记了${result.minesMarked}个地雷`;
    addLog(`标记了${result.minesMarked}个地雷`, 'success');
  } else {
    solverState.status = '没有可以确定的地雷';
    addLog('没有可以确定的地雷', 'warning');
  }

  updateMineCount();
  updateUI(solverState);
  return getStatus();
}

// 停止解算器
function stopSolver() {
  if(solverState.isRunning){
    solverState.isRunning=false;
    solverState.status='已停止';
    addLog('解算器已停止', 'warning');
    updateUI(solverState);
    if(solverState.timeoutId){
      clearTimeout(solverState.timeoutId);
      solverState.timeoutId = null;
    }
  }
  return getStatus();
}

// 重置状态（新游戏）
function resetSolverState() {
  solverState.isRunning = false;
  solverState.moveCount = 0;
  solverState.minesFound = 0;
  solverState.totalMines = 0;
  solverState.status = '检测到新游戏';
  solverState.currentDelay = 0;
  if(solverState.timeoutId) {
    clearTimeout(solverState.timeoutId);
    solverState.timeoutId = null;
  }
  addLog('检测到新游戏，重置解算器状态', 'info');
  updateUI(solverState);
}

// 获取当前状态对象
function getStatus() {
  return {
    isRunning: solverState.isRunning,
    moveCount: solverState.moveCount,
    minesFound: solverState.minesFound,
    totalMines: solverState.totalMines,
    status: solverState.status || '等待开始',
    currentDelay: solverState.currentDelay
  };
}

// ============================================================================
// 第Ⅴ部分：事件监听与初始化
// ============================================================================

function observeGameChanges() {
  const gameArea = document.querySelector('.game');
  if(!gameArea) return;
  const observer = new MutationObserver(() => {
    const smiley = document.querySelector('.smiley');
    if(smiley?.className.includes('smiley_happy')){
      resetSolverState();
    }
    if((smiley?.className.includes('smiley_dead')) || isGameFailed()){
      if(solverState.isRunning){
        stopSolver();
        solverState.status = '游戏失败！点到地雷';
        addLog('游戏失败！点到地雷', 'error');
        updateUI(solverState);
      }
    }
  });
  observer.observe(gameArea, { childList:true, subtree:true, attributes:true, attributeFilter:['class'] });
}

// 初始化入口
function initSolver() {
  createSolverUI();
  loadSettings();
  observeGameChanges();
  updateMineCount();
  updateUI(solverState);
  addLog('扫雷解算器已加载', 'success');
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', initSolver);
} else {
  initSolver();
}

// chrome.runtime 消息监听接口（兼容无chrome环境）
if(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage){
  chrome.runtime.onMessage.addListener((req, sender, sendResp) => {
    const { action, data } = req;

    switch(action){
      case 'startGame':
        startGame(data?.delaySettings).then(sendResp);
        return true;

      case 'autoSolve':
        sendResp(startAutoSolver(data?.delaySettings));
        break;

      case 'stepSolve':
        stepSolve(data?.delaySettings).then(sendResp);
        return true;

      case 'markMines':
        markKnownMines(data?.delaySettings).then(sendResp);
        return true;

      case 'stop':
        sendResp(stopSolver());
        break;

      case 'reset':
        resetSolverState();
        sendResp(getStatus());
        break;

      case 'getStatus':
        sendResp(getStatus());
        break;

      case 'getSettings':
        sendResp(getDelaySettings());
        break;

      case 'setSettings':
        if(data?.settings){
          Object.assign(solverState.delaySettings, data.settings);
          sendResp({success: true, settings: solverState.delaySettings});
        }
        break;

      default:
        sendResp({status:'未知操作', action});
    }
  });
}
