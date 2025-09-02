import subprocess
import re

def get_modified_md_files():
    """
    获取本次 PR 修改的 Markdown 文件（新增或修改）
    """
    print("➡️ 调用 get_modified_md_files() ...")
    result = subprocess.run(
        ["git", "diff", "--diff-filter=AM", "--name-only", "origin/main...HEAD"],
        capture_output=True, text=True
    )
    print(f"git diff 输出:\n{result.stdout}")
    files = result.stdout.strip().split("\n") if result.stdout.strip() else []
    md_files = [f for f in files if f.endswith(".md")]
    print(f"筛选出的新增/修改 md 文件: {md_files}")
    return md_files

def get_commit_date():
    """
    获取最新提交日期 (yyyy-mm-dd)
    """
    print("➡️ 调用 get_commit_date() ...")
    result = subprocess.run(
        ["git", "log", "-1", "--format=%cd", "--date=short"],
        capture_output=True, text=True
    )
    commit_date = result.stdout.strip()
    print(f"最新提交日期: {commit_date}")
    return commit_date

def ensure_created_date(content: str, created: str) -> str:
    """
    解析 front-matter，若没有 createdDate 字段则添加。
    """
    print("➡️ 调用 ensure_created_date() ...")
    fm_pattern = re.compile(r"^---\s*\n(.*?)\n---\s*\n?", re.S)
    match = fm_pattern.match(content)

    if match:
        print("✅ 检测到 frontmatter")
        frontmatter = match.group(1)
        if re.search(r"^createdDate:.*$", frontmatter, re.M):
            print("⚠️ frontmatter 已存在 createdDate")
            return content
        else:
            print("📝 frontmatter 中没有 createdDate，准备添加")
            # 在 frontmatter 末尾添加 createdDate
            new_fm = frontmatter.strip() + f"\ncreatedDate: {created}"
            return f"---\n{new_fm}\n---\n" + content[match.end():]
    else:
        print("⚠️ 文件没有 frontmatter，新建一个")
        return f"---\ncreatedDate: {created}\n---\n\n{content}"

def add_created_date(file_path, created_date):
    print(f"➡️ 调用 add_created_date() 处理文件: {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    print(f"📄 {file_path} 原始内容前 10 行:")
    for line in content.splitlines()[:10]:
        print(line)
    print("--- 文件预览结束 ---")

    new_content = ensure_created_date(content, created_date)

    if new_content != content:
        print(f"✏️ 修改后的 {file_path} 前 10 行:")
        for line in new_content.splitlines()[:10]:
            print(line)
        print("--- 修改预览结束 ---")

        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"✅ 已写回 {file_path} (added createdDate)")
    else:
        print(f"ℹ️ {file_path} 已有 createdDate，无需修改")

def main():
    print("🚀 脚本开始执行")
    md_files = get_modified_md_files()
    if not md_files:
        print("ℹ️ 本次 PR 没有修改 md 文件，脚本结束")
        return

    created_date = get_commit_date()
    for f in md_files:
        print(f"🔧 正在处理 {f}")
        add_created_date(f, created_date)

    print("🏁 脚本执行结束")

if __name__ == "__main__":
    main()
