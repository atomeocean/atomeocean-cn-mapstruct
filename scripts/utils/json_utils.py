"""
JSON工具类脚本，用于处理JSON格式数据
"""

import json
import argparse
from scripts.utils.logging_utils import setup_logging

setup_logging()

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--pr", required=True, help="PR data as JSON string")
    args = parser.parse_args()

    # 把 JSON 字符串解析成字典
    pr_data = json.loads(args.pr)

    # 将内容写入标准输出中
    print(json.dumps(pr_data, indent=2))

if __name__ == "__main__":
    main()