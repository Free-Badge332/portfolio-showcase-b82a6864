# Replace the "What I Do" photo

- Upload the new photo (white sweater, blue sunglasses, outdoors) as the portrait image.
- Point the "What I Do" section to the new photo instead of the current one.
- Update the photo description to: "Ezadin Badiru in a white sweater and blue sunglasses, leaning on a railing outdoors".
- Adjust the crop focus slightly upward so the face stays visible in the tall frame.
- Check in the preview that the new photo loads.

## Technical details
- `lovable-assets create --file /mnt/user-uploads/image.png --filename ezadin-portrait-2.png > src/assets/ezadin-portrait-2.png.asset.json`
- Update import + alt in `src/portfolio/components/WhatIDo.tsx`; `object-position: 50% 30%` in `WhatIDo.css`.
