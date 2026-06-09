"""
fix-generic-prompts.py
----------------------
Embeds options/answer into generic MCQ prompts so each question has a unique prompt.
Targets: orthographe and dictee categories (and any other with generic prompts).

Usage:
    python scripts/fix-generic-prompts.py
    python scripts/fix-generic-prompts.py --dry-run
"""
import json, glob, sys, os, argparse

sys.stdout.reconfigure(encoding='utf-8')

parser = argparse.ArgumentParser()
parser.add_argument('--dry-run', action='store_true', help='Print changes without saving')
args = parser.parse_args()

GENERIC_PROMPTS = {
    "Quelle orthographe est correcte ?",
    "Quelle phrase est correctement orthographiée ?",
    "Quel mot est bien écrit ?",
    "Quelle est la bonne orthographe ?",
    "La phrase correcte :",
}

def make_unique_prompt(q):
    p = q.get('prompt', '').strip()
    opts = q.get('options', [])
    ans = q.get('answer', '')

    if p == "Quel mot est bien écrit ?" and opts:
        return f"Quel mot est bien écrit : {', '.join(opts[:-1])} ou {opts[-1]} ?"
    elif p == "Quelle est la bonne orthographe ?" and opts:
        return f"Quelle est la bonne orthographe : {', '.join(opts[:-1])} ou {opts[-1]} ?"
    elif p == "Quelle orthographe est correcte ?" and ans:
        snippet = ans[:40].rstrip(' .,')
        return f"Quelle orthographe est correcte (ex. « {snippet}… »)?"
    elif p == "Quelle phrase est correctement orthographiée ?" and ans:
        snippet = ans[:35].rstrip(' .,')
        return f"Quelle phrase est correcte : « {snippet}… » ?"
    elif p == "La phrase correcte :" and ans:
        snippet = ans[:40].rstrip(' .,')
        return f"La phrase correcte (« {snippet}… ») :"
    return p

files = sorted(glob.glob('src/content/exams/**/*.json', recursive=True))
total_fixed = 0

for f in files:
    with open(f, encoding='utf-8') as fh:
        d = json.load(fh)

    changed = False
    for ldata in d.get('levels', {}).values():
        for q in ldata.get('questions', []):
            p = q.get('prompt', '').strip()
            if p in GENERIC_PROMPTS:
                new_p = make_unique_prompt(q)
                if new_p != p:
                    if args.dry_run:
                        print(f'  [{os.path.basename(f)}] "{p}" → "{new_p[:60]}"')
                    else:
                        q['prompt'] = new_p
                    changed = True
                    total_fixed += 1

    if changed and not args.dry_run:
        with open(f, 'w', encoding='utf-8') as fh:
            json.dump(d, fh, ensure_ascii=False, indent=2)
        print(f'Fixed: {os.path.basename(f)}')

print(f'\nTotal prompts {"would be " if args.dry_run else ""}fixed: {total_fixed}')
