#!/usr/bin/env python3
import os
import zipfile
import shutil
import sys

def main():
    root_dir = "/app/applet"
    public_dir = os.path.join(root_dir, "public")
    os.makedirs(public_dir, exist_ok=True)
    
    zip_filename = "fortnite-vbuck-store-source.zip"
    target_zip_public = os.path.join(public_dir, zip_filename)
    target_zip_root = os.path.join(root_dir, zip_filename)
    artifact_dir = "/.aistudio/artifacts/brain/7026ff8b-4138-40c3-b291-a45a18247503"
    os.makedirs(artifact_dir, exist_ok=True)
    target_zip_artifact = os.path.join(artifact_dir, zip_filename)
    
    # Files and folders to exclude
    EXCLUDE_DIRS = {
        'node_modules',
        '.git',
        'dist',
        '.vite',
        '.cache',
        '__pycache__'
    }
    EXCLUDE_FILES = {
        zip_filename,
        'bun.lock',
        '.DS_Store'
    }
    
    included_files = []
    
    print("Building ZIP archive...")
    with zipfile.ZipFile(target_zip_public, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zipf:
        for foldername, subfolders, filenames in os.walk(root_dir):
            # Modify subfolders in-place to exclude unwanted directories
            subfolders[:] = [d for d in subfolders if d not in EXCLUDE_DIRS]
            
            for filename in filenames:
                if filename in EXCLUDE_FILES or filename.endswith('.zip') or filename.endswith('.pyc'):
                    continue
                
                filepath = os.path.join(foldername, filename)
                relpath = os.path.relpath(filepath, root_dir)
                
                # Exclude files inside public/fortnite-vbuck-store-source.zip or temporary artifacts
                if relpath.startswith("public/" + zip_filename):
                    continue
                if relpath.startswith(".aistudio"):
                    continue
                
                zipf.write(filepath, arcname=relpath)
                included_files.append(relpath)
                
    # Copy to root and artifact directory
    shutil.copy2(target_zip_public, target_zip_root)
    shutil.copy2(target_zip_public, target_zip_artifact)
    
    zip_size_bytes = os.path.getsize(target_zip_public)
    zip_size_mb = zip_size_bytes / (1024 * 1024)
    
    print(f"SUCCESS: Created {zip_filename}")
    print(f"File size: {zip_size_mb:.2f} MB ({zip_size_bytes} bytes)")
    print(f"Total files included: {len(included_files)}")
    print(f"Locations:")
    print(f"  1. {target_zip_public}")
    print(f"  2. {target_zip_root}")
    print(f"  3. {target_zip_artifact}")
    
    # Verification test
    print("\nVerifying archive integrity...")
    with zipfile.ZipFile(target_zip_public, 'r') as verify_zip:
        bad_file = verify_zip.testzip()
        if bad_file:
            print(f"ERROR: Corrupt file detected in archive: {bad_file}", file=sys.stderr)
            sys.exit(1)
        namelist = verify_zip.namelist()
        print(f"Verification passed: {len(namelist)} entries successfully verified.")
        
        # Check essential files
        required_keys = [
            'package.json',
            'index.html',
            'server.ts',
            'src/App.tsx',
            'src/main.tsx',
            'src/index.css',
            'server/db.ts',
            'data/database.json',
            'vite.config.ts',
            'tsconfig.json',
            'vercel.json',
            '.env.example',
            'README.md'
        ]
        missing = [req for req in required_keys if req not in namelist]
        if missing:
            print(f"WARNING: Missing key files in archive: {missing}", file=sys.stderr)
            sys.exit(1)
        else:
            print(f"All {len(required_keys)} critical source files confirmed present.")

if __name__ == "__main__":
    main()
