# 扫雷自动解算器 (Minesweeper Auto Solver) ⚡

## 中文文档 🇨🇳

### 项目简介 🌟

这是一个专为 `https://minesweeper.online/` 网站开发的谷歌浏览器扩展插件，能够自动解算扫雷游戏，提高游戏体验和效率。

### 功能特性 🚀

- **自动扫雷** - 全自动完成整个扫雷游戏 🎮
- **单步扫雷** - 手动控制每一步操作，方便学习 📝
- **标记地雷** - 自动标记所有已确定的地雷位置 🚩
- **显示可能的地雷点/安全点** - 在格子上显示可能的危险和安全位置 🔴🟢
- **拟人化操作** - 模拟人类玩家的操作方式 ⚙️
- **抗检测模式** - 避免被系统检测为机器人 🔒
- **可调节延迟** - 自定义操作间的延迟时间 ⏱️
- **实时状态监控** - 显示游戏进度和各项指标 📊

### 安装方法 📥

#### 开发模式安装

1. 克隆或下载本项目到本地计算机
2. 打开谷歌浏览器，访问 `chrome://extensions/`
3. 启用右上角的「开发者模式」开关
4. 点击「加载已解压的扩展程序」按钮
5. 选择项目文件夹，点击「确定」
6. 扩展程序已安装完成，图标会出现在浏览器工具栏中

### 使用方法 📖

#### 方法一：使用悬浮UI

1. 访问 `https://minesweeper.online/` 网站
2. 游戏页面加载完成后，右侧会自动出现悬浮控制面板
3. 使用控制面板上的按钮：
   - 🚀 自动扫雷 - 开始自动解算游戏
   - ⏭️ 单步扫雷 - 执行下一步操作
   - 🚩 标记地雷 - 标记已确定的地雷
   - ⏹️ 停止 - 停止当前操作
4. 调整设置：
   - 最小延迟/最大延迟 - 设置操作间的时间间隔范围
   - 启用随机延迟 - 随机化操作间隔
   - 拟人化操作 - 模拟人类玩家行为
   - 抗检测模式 - 避免被系统检测
   - 显示可能地雷/安全点 - 在格子上显示提示点

#### 方法二：使用扩展弹出窗口

1. 访问 `https://minesweeper.online/` 网站
2. 点击浏览器工具栏中的扩展图标，打开弹出窗口
3. 使用弹出窗口中的按钮进行操作：
   - 开始游戏 - 初始化游戏
   - 自动扫雷 - 开始自动解算
   - 单步扫雷 - 执行下一步
   - 标记地雷 - 标记已确定的地雷
   - 重置 - 重置状态

### 技术特点 💻

- **高效算法** - 使用智能推理算法解算扫雷游戏
- **用户友好界面** - 美观、直观的操作界面
- **实时状态更新** - 显示进度、已发现地雷数和操作次数
- **可定制性** - 多种设置选项，满足不同需求
- **可视化提示** - 在地雷可能位置显示红色点，安全位置显示绿色点

### 注意事项 ⚠️

1. 此扩展仅在 `https://minesweeper.online/` 网站上工作
2. 建议使用适当的延迟设置，避免被系统检测为机器人
3. 某些特殊情况下，算法可能无法确定下一步操作（需要猜测），程序会自动选择最可能安全的位置
4. 显示提示点功能可独立使用，无需开启自动扫雷

### 许可证 📄

此项目仅供学习和研究使用，请遵守相关网站的使用条款。

### 贡献 🤝

欢迎提交Issue或Pull Request来帮助改进这个项目！

---

## English Documentation 🇺🇸

### Project Introduction 🌟

A Chrome extension designed specifically for `https://minesweeper.online/` website, capable of automatically solving Minesweeper games, enhancing gaming experience and efficiency.

### Features 🚀

- **Auto Solve** - Complete the entire Minesweeper game automatically 🎮
- **Step Solve** - Manual control of each step for learning purposes 📝
- **Mark Mines** - Automatically mark all identified mine locations 🚩
- **Show Possible Mines/Safe Spots** - Display possible dangerous and safe locations on cells 🔴🟢
- **Human-like Operation** - Simulate human player behavior ⚙️
- **Anti-detection Mode** - Avoid being detected as a robot 🔒
- **Adjustable Delay** - Customize time intervals between operations ⏱️
- **Real-time Status Monitoring** - Display game progress and various metrics 📊

### Installation 📥

#### Development Mode Installation

1. Clone or download this project to your local computer
2. Open Google Chrome and navigate to `chrome://extensions/`
3. Enable the "Developer mode" toggle in the top right corner
4. Click the "Load unpacked" button
5. Select the project folder and click "OK"
6. The extension is now installed and its icon will appear in the browser toolbar

### Usage 📖

#### Method 1: Using Floating UI

1. Visit the `https://minesweeper.online/` website
2. After the game page loads, a floating control panel will automatically appear on the right side
3. Use the buttons on the control panel:
   - 🚀 Auto Solve - Start automatic game solving
   - ⏭️ Step Solve - Execute the next move
   - 🚩 Mark Mines - Mark identified mines
   - ⏹️ Stop - Stop current operation
4. Adjust settings:
   - Min Delay/Max Delay - Set the time interval range between operations
   - Enable Random Delay - Randomize operation intervals
   - Human-like Operation - Simulate human player behavior
   - Anti-detection Mode - Avoid system detection
   - Show Possible Mines/Safe Spots - Display hint dots on cells

#### Method 2: Using Extension Popup

1. Visit the `https://minesweeper.online/` website
2. Click the extension icon in the browser toolbar to open the popup window
3. Use the buttons in the popup window for operations:
   - Start Game - Initialize the game
   - Auto Solve - Start automatic solving
   - Step Solve - Execute the next step
   - Mark Mines - Mark identified mines
   - Reset - Reset status

### Technical Features 💻

- **Efficient Algorithm** - Intelligent inference algorithm to solve Minesweeper games
- **User-friendly Interface** - Beautiful and intuitive operation interface
- **Real-time Status Updates** - Display progress, found mines, and move count
- **Customizability** - Multiple setting options to meet different needs
- **Visual Hints** - Display red dots on possible mine locations and green dots on safe locations

### Notes ⚠️

1. This extension only works on the `https://minesweeper.online/` website
2. It is recommended to use appropriate delay settings to avoid being detected as a robot
3. In some special cases, the algorithm may not be able to determine the next move (requiring a guess), and the program will automatically select the most likely safe position
4. The hint display feature can be used independently without enabling auto-solving

### License 📄

This project is for learning and research purposes only. Please comply with the terms of service of the relevant websites.

### Contributions 🤝

Contributions are welcome! Feel free to submit issues or pull requests to help improve this project!
