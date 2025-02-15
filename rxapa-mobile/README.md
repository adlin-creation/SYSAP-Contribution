To initialize and update all submodules recursively, use:
```bash
git submodule update --init --recursive
```

If you need to pull the latest changes for all submodules, you can use:
```bash
git submodule foreach git pull origin main
```