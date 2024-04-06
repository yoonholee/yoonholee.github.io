# %%
""" Rough script for converting Obsidian notes to Jekyll-compatible markdown files """
import glob
import os
import re
import shutil
from collections import defaultdict

obsidian_root = "/obsidian"  # Root directory for Obsidian files
src_dir = "/Users/yoonholee/repos/Obsidian/Website/"
dst_dir = "/Users/yoonholee/repos/yoonholee.github.io/_obsidian/"


def ignore_hidden_files(dirname, filenames):
    return [name for name in filenames if name.startswith(".") or name == "smart-chats"]


def get_flat_name(name):
    title_key = name.replace(" ", "-").lower()
    return title_key


def find_obsidian_links(content):
    pattern = r"\[\[(.*?)\]\]"
    return re.findall(pattern, content)


def get_header(name):
    header = f"""---
title: {flat_name_dict[name]}
layout: page
---
# {name}
"""
    return header


def get_backlinks_html(links):
    backlinks = "\n".join(
        f'<a href="{obsidian_root}/{get_flat_name(link)}">{link}</a>' for link in links
    )
    backlinks_html = f"\n\n<div>Linked mentions</div>\n<div>{backlinks}</div>"
    return backlinks_html


def convert_obsidian_links(content, flat_name_dict):
    pattern = r"\[\[(.*?)\]\]"

    def replacer(match):
        link_text = match.group(1)
        link_target = flat_name_dict.get(link_text, link_text)
        return f"[{link_text}]({obsidian_root}/{link_target})"

    return re.sub(pattern, replacer, content)


shutil.rmtree(dst_dir)
shutil.copytree(src_dir, dst_dir, ignore=ignore_hidden_files, dirs_exist_ok=True)

markdown_files = glob.glob(f"{dst_dir}/**/*.md", recursive=True)
print(f"Found {len(markdown_files)} markdown files")

content_dict = {}
flat_name_dict = {}
outgoing_dict = {}
filepath_dict = {}
new_filepath_dict = {}
for filepath in markdown_files:
    name = os.path.basename(filepath)
    name = os.path.splitext(name)[0]
    flat_name = get_flat_name(name)
    with open(filepath, "r") as file:
        content = file.read()
    content_dict[name] = (filepath, content)
    outgoing_dict[name] = find_obsidian_links(content)
    flat_name_dict[name] = flat_name
    new_filepath_dict[name] = f"{dst_dir}/{flat_name}.md"

backlink_dict = defaultdict(list)
for name, links in outgoing_dict.items():
    for link in links:
        backlink_dict[link].append(name)
print(f"Found {sum(len(links) for links in backlink_dict.values())} backlinks")


for name, (filepath, content) in content_dict.items():
    content = convert_obsidian_links(content, flat_name_dict)
    if backlink_dict[name]:
        backlinks_html = get_backlinks_html(backlink_dict[name])
        content = content + backlinks_html
    header = get_header(name)
    content = header + content
    with open(filepath, "w") as file:
        file.write(content)
    shutil.move(filepath, new_filepath_dict[name])

root_header = """---
title: root
layout: page
---
All Pages
"""
root_content = "\n".join(
    f'- [{name}]({obsidian_root}/{flat_name_dict[name]})'
    for name in flat_name_dict.keys()
)
with open(f"{dst_dir}/root.md", "w") as root_file:
    root_file.write(root_header + root_content)

# %%
