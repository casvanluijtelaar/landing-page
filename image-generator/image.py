from PIL import Image
import numpy as np
import os

def clamp(value, min_val=0, max_val=255):
    # Restrict value to the range [min_val, max_val]
    return max(min_val, min(value, max_val))

image_size = 512
center_coord = (image_size - 1) / 2.0  # Center coordinate for both axes

barrel_map = Image.new('RGB', (image_size, image_size))  # Create a new RGB image
pixel_map = barrel_map.load()                            # Pixel access object

for pixel_y in range(image_size):
    for pixel_x in range(image_size):
        offset_x = pixel_x - center_coord
        offset_y = pixel_y - center_coord
        distance_from_center = np.sqrt(offset_x**2 + offset_y**2)
        normalized_distance = distance_from_center / center_coord

        # Use a higher power for more pronounced edge distortion
        barrel_distortion = normalized_distance**4  # Try 4, 6, or even higher

        # Optionally, increase distortion_strength
        distortion_strength = 2.5  # Try values between 2 and 4

        distorted_x = distortion_strength * barrel_distortion * offset_x
        distorted_y = distortion_strength * barrel_distortion * offset_y

        red_channel = int(round(128 + distorted_x))
        green_channel = int(round(128 + distorted_y))
        blue_channel = 0

        pixel_map[pixel_x, pixel_y] = (
            clamp(red_channel),
            clamp(green_channel),
            blue_channel
        )
# Save to the public directory as before
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)
output_path = os.path.join(project_root, 'public', 'barrel-map.png')

barrel_map.save(output_path)
print(f"Generated new RGB barrel-map.png at {output_path}")