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

    # 文件以 frontmatter 开头
    if content.lstrip().startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            body = parts[2]

            if "createdDate:" in frontmatter:
                return  # frontmatter 已有 createdDate

            # 在现有 frontmatter 最前面插入 createdDate
            new_frontmatter = f"\ncreatedDate: {created_date}\n{frontmatter}"
            new_content = f"---{new_frontmatter}---{body}"
        else:
            # 开头是 --- 但不完整，直接新建 frontmatter
            new_content = f"---\ncreatedDate: {created_date}\n---\n\n{content}"
    else:
        # 没有 frontmatter，直接新建
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
