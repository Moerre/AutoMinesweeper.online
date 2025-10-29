document.addEventListener('DOMContentLoaded', function() {
  // 获取按钮元素
  const startGameBtn = document.getElementById('startGame');
  const autoSolveBtn = document.getElementById('autoSolve');
  const stepSolveBtn = document.getElementById('stepSolve');
  const markMinesBtn = document.getElementById('markMines');
  const resetBtn = document.getElementById('reset');
  
  // 获取设置元素
  const minDelayInput = document.getElementById('minDelay');
  const maxDelayInput = document.getElementById('maxDelay');
  const enableDelayCheckbox = document.getElementById('enableDelay');
  const humanLikeCheckbox = document.getElementById('humanLike');
  
  // 获取状态元素
  const statusText = document.getElementById('statusText');
  const minesFound = document.getElementById('minesFound');
  const totalMines = document.getElementById('totalMines');
  const moveCount = document.getElementById('moveCount');
  const currentDelay = document.getElementById('currentDelay');
  const progressBar = document.getElementById('progressBar');
  
  // 发送消息到内容脚本
  function sendMessage(action, data = {}) {
    // 获取延迟设置
    data.delaySettings = {
      minDelay: parseInt(minDelayInput.value) || 800,
      maxDelay: parseInt(maxDelayInput.value) || 2500,
      enableDelay: enableDelayCheckbox.checked,
      humanLike: humanLikeCheckbox.checked
    };
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length === 0) {
        updateUI({status: '请在扫雷游戏页面使用此扩展'});
        return;
      }
      
      chrome.tabs.sendMessage(tabs[0].id, {
        action: action,
        data: data
      }, function(response) {
        if (chrome.runtime.lastError) {
          updateUI({status: '请在扫雷游戏页面使用此扩展'});
        } else {
          updateUI(response);
        }
      });
    });
  }
  
  // 更新UI
  function updateUI(data) {
    if (!data) return;
    
    statusText.textContent = data.status || '未知状态';
    minesFound.textContent = data.minesFound || 0;
    totalMines.textContent = data.totalMines || 0;
    moveCount.textContent = data.moveCount || 0;
    currentDelay.textContent = data.currentDelay || 0;
    
    // 更新进度条
    if (data.totalMines && data.minesFound) {
      const progress = (data.minesFound / data.totalMines) * 100;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
  }
  
  // 按钮事件监听
  startGameBtn.addEventListener('click', function() {
    sendMessage('startGame');
  });
  
  autoSolveBtn.addEventListener('click', function() {
    sendMessage('autoSolve');
  });
  
  stepSolveBtn.addEventListener('click', function() {
    sendMessage('stepSolve');
  });
  
  markMinesBtn.addEventListener('click', function() {
    sendMessage('markMines');
  });
  
  resetBtn.addEventListener('click', function() {
    sendMessage('reset');
    statusText.textContent = '已重置';
    minesFound.textContent = '0';
    totalMines.textContent = '0';
    moveCount.textContent = '0';
    currentDelay.textContent = '0';
    progressBar.style.width = '0%';
  });
  
  // 初始获取状态
  sendMessage('getStatus');
});