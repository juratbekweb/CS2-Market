from pathlib import Path
import re
root = Path('src/data')
text = (root/'products.js').read_text(encoding='utf-8')
product_names = re.findall(r"name:\s*['\"]([^'\"]+)['\"]", text)
local_section = re.search(r"const localImages = \{([\s\S]*?)\};", text)
local_keys = set(re.findall(r"['\"]([^'\"]+)['\"]\s*:", local_section.group(1))) if local_section else set()
missing = [n for n in product_names if n not in local_keys]
files=[]
for dir in ['src/images/gloves','src/images/knives','src/images/weapons']:
    p=Path(dir)
    if p.exists():
        for f in p.iterdir():
            if f.is_file():
                files.append((dir,f.name))

def norm(name):
    return re.sub(r'[^a-z0-9]+',' ', name.lower().replace('|','')).strip()
for name in missing:
    n=norm(name)
    candidates=[(d,f) for d,f in files if n in norm(f) or norm(f) in n or n.split(' ')[-1] in norm(f)]
    if candidates:
        print('MISSING:',name)
        for d,f in candidates[:5]:
            print('  ',d,f)
