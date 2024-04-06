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

def get_read_time_md(content):
    words = content.split()
    mins = len(words) // 200 + 1
    return f"\nread_time: {mins} mins"


def get_backlinks_md(links):
    md = "\nlinked_mentions:"
    for link in links:
        url = f"{obsidian_root}/{get_flat_name(link)}"
        content = content_dict[link][1]
        thumbnail = content.split("\n")[0].strip()[:50]
        filter_chars = ["#", "!", "[", "]", "(", ")", ":", "*", "_", "-"]
        thumbnail = "".join(c for c in thumbnail if c not in filter_chars)
        md += f"\n  - title: {link}\n    url: {url}\n    thumbnail: {thumbnail}"
    return md


def get_header(name, links, content):
    header = f"""---
title: {name}
layout: obsidian"""
    header += get_read_time_md(content)
    if links:
        header += get_backlinks_md(links)
    header += "\n---\n\n"
    return header

    
def convert_obsidian_links(content):
    pattern = r"\[\[(.*?)\]\]"

    def replacer(match):
        link_text = match.group(1)
        link_target = get_flat_name(link_text)
        # link_target = flat_name_dict.get(link_text, link_text)
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

# Populate empty files for links that don't have content
all_links = [l for links in outgoing_dict.values() for l in links]
empty_links = set(all_links) - set(content_dict.keys())
for link in empty_links:
    content = "This note is empty."
    header = get_header(link, backlink_dict[link], content)
    print(get_flat_name(link))
    with open(f"{dst_dir}/{get_flat_name(link)}.md", "w") as file:
        file.write(header + content)

for name, (filepath, content) in content_dict.items():
    content = convert_obsidian_links(content)
    header = get_header(name, backlink_dict[name], content)
    content = header + content
    with open(filepath, "w") as file:
        file.write(content)
    shutil.move(filepath, new_filepath_dict[name])

root_header = """---
title: Root
layout: obsidian
read_time: 1 mins
---
"""
root_content = "\n".join(
    f'- [{name}]({obsidian_root}/{flat_name_dict[name]})'
    for name in flat_name_dict.keys()
)
with open(f"{dst_dir}/root.md", "w") as root_file:
    root_file.write(root_header + root_content)

# %%
