from PIL import Image
import numpy as np
import os

def clamp(value, min_val=0, max_val=255):
    return max(min_val, min(value, max_val))

size = 512
center = size / 2.0

img = Image.new('RGB', (size, size))
pixels = img.load()

strength = 0.1

for y in range(size):
    for x in range(size):
        dx = x - center
        dy = y - center
        dist = np.sqrt(dx*dx + dy*dy)
        norm_dist = dist / center
        distortion = norm_dist**2
        disp_x = strength * distortion * dx
        disp_y = strength * distortion * dy
        r_val = int(128 + disp_x)
        g_val = int(128 + disp_y)
        b_val = 0
        pixels[x, y] = (clamp(r_val), clamp(g_val), b_val)

# Get the absolute path to the directory containing the script
script_dir = os.path.dirname(os.path.abspath(__file__))
# Go up one level to the project root
project_root = os.path.dirname(script_dir)
# Construct the absolute path for the output file
output_path = os.path.join(project_root, 'public', 'barrel-map.png')

img.save(output_path)

print(f"Generated new RGB barrel-map.png at {output_path}")