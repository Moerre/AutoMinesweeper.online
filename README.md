# 扫雷自动解算器 (Minesweeper Auto Solver) ⚡

## 项目简介 (Project Introduction) 🌟

这是一个专为 `https://minesweeper.online/` 网站开发的谷歌浏览器扩展插件，能够自动解算扫雷游戏，提高游戏体验和效率。

A Chrome extension designed specifically for `https://minesweeper.online/` website, capable of automatically solving Minesweeper games, enhancing gaming experience and efficiency.

## 功能特性 (Features) 🚀

- **自动扫雷 (Auto Solve)** - 全自动完成整个扫雷游戏 🎮
- **单步扫雷 (Step Solve)** - 手动控制每一步操作，方便学习 📝
- **标记地雷 (Mark Mines)** - 自动标记所有已确定的地雷位置 🚩
- **拟人化操作 (Human-like Operation)** - 模拟人类玩家的操作方式 ⚙️
- **抗检测模式 (Anti-detection Mode)** - 避免被系统检测为机器人 🔒
- **可调节延迟 (Adjustable Delay)** - 自定义操作间的延迟时间 ⏱️
- **实时状态监控 (Real-time Status)** - 显示游戏进度和各项指标 📊

## 安装方法 (Installation) 📥

### 开发模式安装 (Development Mode Installation)

1. 克隆或下载本项目到本地计算机
   Clone or download this project to your local computer

2. 打开谷歌浏览器，访问 `chrome://extensions/`
   Open Google Chrome and navigate to `chrome://extensions/`

3. 启用右上角的「开发者模式」开关
   Enable the "Developer mode" toggle in the top right corner

4. 点击「加载已解压的扩展程序」按钮
   Click the "Load unpacked" button

5. 选择项目文件夹，点击「确定」
   Select the project folder and click "OK"

6. 扩展程序已安装完成，图标会出现在浏览器工具栏中
   The extension is now installed and its icon will appear in the browser toolbar

## 使用方法 (Usage) 📖

### 方法一：使用悬浮UI (Method 1: Using Floating UI)

1. 访问 `https://minesweeper.online/` 网站
   Visit the `https://minesweeper.online/` website

2. 游戏页面加载完成后，右侧会自动出现悬浮控制面板
   After the game page loads, a floating control panel will automatically appear on the right side

3. 使用控制面板上的按钮：
   Use the buttons on the control panel:
   - 🚀 自动扫雷 - 开始自动解算游戏
     Auto Solve - Start automatic game solving
   - ⏭️ 单步扫雷 - 执行下一步操作
     Step Solve - Execute the next move
   - 🚩 标记地雷 - 标记已确定的地雷
     Mark Mines - Mark identified mines
   - ⏹️ 停止 - 停止当前操作
     Stop - Stop current operation

4. 调整设置：
   Adjust settings:
   - 最小延迟/最大延迟 - 设置操作间的时间间隔范围
     Min Delay/Max Delay - Set the time interval range between operations
   - 启用随机延迟 - 随机化操作间隔
     Enable Random Delay - Randomize operation intervals
   - 拟人化操作 - 模拟人类玩家行为
     Human-like Operation - Simulate human player behavior
   - 抗检测模式 - 避免被系统检测
     Anti-detection Mode - Avoid system detection

### 方法二：使用扩展弹出窗口 (Method 2: Using Extension Popup)

1. 访问 `https://minesweeper.online/` 网站
   Visit the `https://minesweeper.online/` website

2. 点击浏览器工具栏中的扩展图标，打开弹出窗口
   Click the extension icon in the browser toolbar to open the popup window

3. 使用弹出窗口中的按钮进行操作：
   Use the buttons in the popup window for operations:
   - 开始游戏 - 初始化游戏
     Start Game - Initialize the game
   - 自动扫雷 - 开始自动解算
     Auto Solve - Start automatic solving
   - 单步扫雷 - 执行下一步
     Step Solve - Execute the next step
   - 标记地雷 - 标记已确定的地雷
     Mark Mines - Mark identified mines
   - 重置 - 重置状态
     Reset - Reset status

## 技术特点 (Technical Features) 💻

- **高效算法 (Efficient Algorithm)** - 使用智能推理算法解算扫雷游戏
  Intelligent inference algorithm to solve Minesweeper games

- **用户友好界面 (User-friendly Interface)** - 美观、直观的操作界面
  Beautiful and intuitive operation interface

- **实时状态更新 (Real-time Status Updates)** - 显示进度、已发现地雷数和操作次数
  Display progress, found mines, and move count

- **可定制性 (Customizability)** - 多种设置选项，满足不同需求
  Multiple setting options to meet different needs

## 注意事项 (Notes) ⚠️

1. 此扩展仅在 `https://minesweeper.online/` 网站上工作
   This extension only works on the `https://minesweeper.online/` website

2. 建议使用适当的延迟设置，避免被系统检测为机器人
   It is recommended to use appropriate delay settings to avoid being detected as a robot

3. 某些特殊情况下，算法可能无法确定下一步操作（需要猜测），程序会自动选择最可能安全的位置
   In some special cases, the algorithm may not be able to determine the next move (requiring a guess), and the program will automatically select the most likely safe position

## 许可证 (License) 📄

此项目仅供学习和研究使用，请遵守相关网站的使用条款。

This project is for learning and research purposes only. Please comply with the terms of service of the relevant websites.

## 贡献 (Contributions) 🤝

欢迎提交Issue或Pull Request来帮助改进这个项目！

Contributions are welcome! Feel free to submit issues or pull requests to help improve this project!