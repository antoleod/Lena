"""
Genera todos los iconos de LénaLand desde la imagen fuente.
Uso: python generate_icons.py lenaland-logo.png
La imagen fuente debe ser cuadrada (al menos 1024x1024).
"""
import sys
import os

try:
    from PIL import Image
except ImportError:
    print("Instalando Pillow...")
    os.system("pip install Pillow")
    from PIL import Image

SIZES = [16, 32, 48, 64, 72, 96, 120, 128, 144, 152, 167, 180, 192, 256, 384, 512, 1024]
OUTPUT_DIR = os.path.join("public", "assets", "iconos")

def generate(source_path):
    if not os.path.exists(source_path):
        print(f"❌ No se encontró: {source_path}")
        return

    img = Image.open(source_path).convert("RGBA")
    w, h = img.size
    print(f"✅ Imagen cargada: {w}x{h}")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for size in SIZES:
        resized = img.resize((size, size), Image.LANCZOS)
        out_path = os.path.join(OUTPUT_DIR, f"icon-{size}.png")
        resized.save(out_path, "PNG", optimize=True)
        print(f"  → icon-{size}.png")

    # Favicon ICO (multi-size)
    favicon_sizes = [(16,16),(32,32),(48,48),(64,64)]
    favicon_imgs = [img.resize(s, Image.LANCZOS) for s in favicon_sizes]
    favicon_path = os.path.join("public", "favicon.ico")
    favicon_imgs[0].save(favicon_path, format="ICO", sizes=favicon_sizes)
    print(f"  → favicon.ico")

    print(f"\n🎉 ¡Listo! {len(SIZES)} iconos generados en {OUTPUT_DIR}/")

if __name__ == "__main__":
    source = sys.argv[1] if len(sys.argv) > 1 else "lenaland-logo.png"
    generate(source)
