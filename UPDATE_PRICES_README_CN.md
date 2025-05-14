# ISP价格更新工具

本文档介绍如何使用Excel数据导入工具更新React ISP比较网站中的ISP价格。

## 概述

`update_prices.py`脚本可自动从Excel文件更新ISP价格到网站的JSON数据。它处理以下任务：

- 读取包含ISP价格数据的Excel文件
- 解析网络类型（NBN、Opticomm、RedTrain）
- 匹配Excel和JSON文件中的ISP提供商
- 更新价格，同时维持折扣关系
- 创建原始数据的备份
- 显示详细的变更摘要

## 系统要求

- Python 3.6+
- 必需的Python包：
  - pandas
  - openpyxl

安装所需包：

```bash
pip install pandas openpyxl
```

## Excel文件格式

Excel文件应遵循以下结构：

1. 第一列为网络类型（NBN、OPTICOMM等）
2. 每个网络部分的标题行中包含速度等级
3. "Min Price ISP"和"Max Price ISP"行列出提供商
4. 每个提供商行下方为价格行
5. 可选的专用"OCCOM Price"行，包含直接定价

示例：

```
|          |           | 12/1M   | 25/5M  | 50/20M | ...  |
|----------|-----------|---------|--------|--------|------|
| NBN      |           |         |        |        |      |
|          | Min ISP   | TPG     | MATE   | KOGAN  | ...  |
|          | Min Price | 54.99   | 40     | 59.90  | ...  |
|          | Max ISP   | AUSSIE  | TELSTRA| TELSTRA| ...  |
|          | Max Price | 69      | 89     | 95     | ...  |
|          | OCCOM     | 58      | 65     | 75     | ...  |
```

## 使用方法

### 基本用法

从命令行运行脚本：

```bash
python update_prices.py
```

这将：
1. 使用默认Excel文件（`Price Comparison May 2025.xlsx`）
2. 更新默认JSON文件（`src/data/ispData.json`）
3. 创建原始JSON文件的备份
4. 显示进行的详细更改

### 高级用法

指定自定义文件路径：

```bash
python update_prices.py [excel文件路径] [json文件路径]
```

例如：

```bash
python update_prices.py "data/June 2025 Prices.xlsx" "src/data/custom-data.json"
```

## 价格更新工作流程

1. 从相关方获取最新的Excel价格文件
2. 将Excel文件放在项目根目录
3. 运行更新脚本：
   ```bash
   python update_prices.py "您的新价格文件.xlsx"
   ```
4. 查看控制台输出中的更改内容
5. 测试网站以确保所有价格正确显示
6. 将更新后的JSON文件提交到版本控制系统

## 故障排除

如果脚本没有找到或更新某些价格：

1. 检查Excel文件格式是否与预期结构匹配
2. 验证Excel中的提供商名称是否与JSON文件中的名称匹配
3. 确保Excel文件包含所有必需的网络类型和速度等级
4. 检查控制台输出是否有警告或错误

## 备份和恢复

脚本会自动创建带有时间戳的备份文件。要从备份恢复：

```bash
cp src/data/ispData.json.[时间戳].bak src/data/ispData.json
```

## 添加新提供商或速度等级

该脚本仅更新现有的提供商和计划。要添加新的提供商或速度等级：

1. 首先在JSON文件中手动添加新提供商，并设置默认值
2. 然后运行脚本以更新实际价格

## 未来开发

该脚本可能会增加以下功能：

- 添加更新typicalEveningSpeed值的支持
- 实现更强大的错误处理和验证
- 为非技术用户添加图形用户界面，方便价格更新 