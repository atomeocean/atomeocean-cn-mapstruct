import subprocess

def get_added_md_files():
    """获取本次提交新增的 md 文件"""
    result = subprocess.run(
        ["git", "diff", "--diff-filter=A", "--name-only", "origin/main...HEAD"],
        capture_output=True, text=True
    )
    files = result.stdout.strip().split("\n")
    return [f for f in files if f.endswith(".md")]

def get_commit_date():
    """获取最新提交日期 (yyyy-mm-dd)"""
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cd", "--date=short"],
        capture_output=True, text=True
    )
    return result.stdout.strip()

def add_created_date(file_path, created_date):
    """在 md 文件的 frontmatter 中添加 createdDate"""
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    if "createdDate:" in content:
        return  # 已经有了就不处理

    if content.startswith("---"):
        # 有 frontmatter，插入到第二行
        lines = content.split("\n")
        lines.insert(1, f"createdDate: {created_date}")
        new_content = "\n".join(lines)
    else:
        # 没有 frontmatter，新建一个
        new_content = f"---\ncreatedDate: {created_date}\n---\n\n{content}"

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

def main():
    md_files = get_added_md_files()
    if not md_files:
        print("没有新增 md 文件")
        return

    created_date = get_commit_date()
    for f in md_files:
        print(f"处理文件: {f}")
        add_created_date(f, created_date)

if __name__ == "__main__":
    main()
