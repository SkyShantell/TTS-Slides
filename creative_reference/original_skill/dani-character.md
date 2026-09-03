# Dani — Locked Character Reference

Dani is the page owner and primary presenter for ALL TikTok product slide decks. She is a real person whose likeness gets rendered into whatever illustration style the slide calls for — just like the Simpsons-style slides in the 198-slide dataset use a yellow animated character who IS the actual creator of that page, Dani is always the character, regardless of which art style is applied.

**The style changes. The character never does.**

Every prompt must render Dani's specific facial identity, hair, and signature accessories into the chosen style — not a generic Black woman, not a placeholder — HER.

---

## Dani's Core Identity (Style-Agnostic)

These traits survive across ALL illustration styles:

| Trait | Spec |
|---|---|
| Ethnicity | Black woman, mixed heritage appearance |
| Skin tone | Medium warm brown (translates to whatever that style calls for — flat fill in cel-shaded, detailed in editorial, stylized in Simpsons-variant) |
| Hair | Voluminous 3C/4A natural black curly hair — large, round silhouette, tight ringlets, shoulder-length. **Hair volume is the #1 identity marker. Never shrink it.** |
| Eyes | Green-hazel, almond-shaped, expressive |
| Brows | Bold, arched, defined — dark |
| Lips | Full, nude/mauve tone |
| Nose ring | Subtle small nose ring (stud or hoop) |
| Earrings | **Gold hoop earrings always — medium to large. Non-negotiable.** |
| Necklaces | **Layered delicate gold chains with nameplate — always visible at neckline.** |
| Build | Athletic/curvy |

---

## Real-Photo Reference

Source: 5-image reference package (front, side, back angles + face reference).

For photorealistic prompts:
- White fitted ribbed scoop-neck tee in reference photos
- Natural makeup, glowing skin
- Green-hazel eyes are visible and distinctive
- Hair photographed from all 4 angles — very full, defined curl pattern

---

## Style Rendering Guide

### Style 1 — Flat/Cel-Shaded Illustration (most common)
*Like the "3 signs of low drive" and "feel better before summer" slides she already has*

- Flat warm medium-brown skin fill, 2–3 tonal values
- Hair: solid black silhouette with curl texture lines, very full round shape
- Bold black outlines throughout
- Gold hoops rendered as simple gold circles
- Necklace chains visible as gold lines at collar
- Green-hazel eyes with white highlights
- White or off-white background for problem/list slides

**Prompt prefix:** `flat cel-shaded 2D illustration, Black woman character, Dani, medium warm brown skin, voluminous 3C natural black curly hair large round silhouette, large gold hoop earrings, layered gold necklace chains, green-hazel almond eyes with bold eyeliner, full lips, bold arched brows, small nose ring, clean black outlines, fashion illustration style, 9:16 vertical portrait`

---

### Style 2 — Editorial Illustrated
*More detailed shading, used for aspirational/beauty/lifestyle hooks*

- Detailed skin shading with highlights
- Individual curl definition, slight hair gloss
- Richer background environments
- Closer to high-fashion magazine illustration

**Prompt prefix:** `editorial fashion illustration, detailed shading, Black woman Dani, medium warm brown skin, voluminous natural black 3C curly hair with defined ringlets, large gold hoop earrings, delicate layered gold necklace chains, green-hazel eyes, bold arched brows, full lips, small nose ring, warm lighting, high detail, 9:16 vertical`

---

### Style 3 — Simpsons-Variant (for Simpsons-style slide narratives)
*Same as the yellow animated Simpsons slides in the 198-slide dataset — but it's DANI. Her face, her hair, her jewelry, her identity — just rendered in Simpsons style*

- Yellow skin (this is the style, not the character — she's still Dani)
- Black thick brows, white oval eyes with small pupils
- Her signature voluminous curly black hair — still large and round
- Gold hoop earrings still present
- Necklace still present
- Expressive Simpsons face
- White background for problem slides, full scenes for dialogue slides

**Prompt prefix:** `Simpsons-style animated character, yellow skin, black thick eyebrows, white oval eyes, Dani, voluminous natural curly black hair large round afro silhouette, gold hoop earrings, gold necklace chain, full lips, clean animation style, 9:16 vertical portrait`

---

### Style 4 — Disney/Pixar 3D Variant
*Semi-realistic 3D render — Dani's face and identity in a more premium animated style*

- Warm brown skin with soft lighting
- Realistic curly hair volume maintained
- Gold jewelry rendered in 3D
- Feels like a Pixar movie character

**Prompt prefix:** `Disney Pixar 3D animation style, Black woman Dani, warm brown skin, voluminous natural black curly hair, large gold hoop earrings, layered gold necklace, green-hazel eyes, bold brows, full lips, small nose ring, soft studio lighting, 9:16 vertical`

---

## Expression Library (from character design sheet)

Always specify which expression per slide:

| ID | Expression | Use When |
|---|---|---|
| E1 | Neutral / Unbothered | Hook slides, "before" state, problem acknowledgment |
| E2 | Slight Smile | Gentle benefit reveals, reassurance |
| E3 | Bored / Tired | "Signs you have [problem]" — relatable exhaustion (sitting on couch, head on hand) |
| E4 | Side-Eye / Skeptical | Comparison slides, "why would you still do X" |
| E5 | Laughing / Happy | Solution reveal, CTA, positive outcome |
| E6 | Shocked / Surprised | Ingredient reveals, price/deal reveals, "you won't believe" |

---

## Pose Library

| ID | Pose | Use When |
|---|---|---|
| P1 | Sitting on couch, slouched | Low energy, bored, problem state slides |
| P2 | Standing full body, confident | Active hooks, summer lifestyle, aspirational |
| P3 | Standing with props (bag, sunglasses) | Editorial lifestyle slides |
| P4 | Holding product toward camera | Product reveal, feature slides, UGC-style |
| P5 | Close-up portrait, head & shoulders | Expression-forward hooks, reactions |
| P6 | Scene / dialogue / interacting | Social proof, comparison, testimonial |

---

## Outfit Library

| Outfit | Style |
|---|---|
| Black zip-up crop + dark grey joggers + black/white Jordan 1s | Casual, bored, couch |
| Black sports bra + high-waist black leggings + woven tote + sunglasses | Active, summer, lifestyle |
| Oversized hoodie or cropped tee + joggers | Chill, relatable |
| Fitted top + jeans or skirt | Going out, social scene |
| Workout fit (sports bra + leggings) | Gym, fitness, health |

---

## Hard Rules — Never Break These

1. **Hair must be large and round** — voluminous 3C afro-curl silhouette. If the hair is small, flat, or straight, the character is wrong.
2. **Gold hoops always** — every single slide, every style
3. **Layered gold necklaces always visible** at neckline
4. **Green-hazel eyes** — not dark brown, not black
5. **Bold arched brows** — never thin
6. **She is DANI regardless of style** — Simpsons variant = Dani in Simpsons style, not a random yellow woman
7. **Never describe her as "a Black woman" generically** — always "Dani" with full specs so the model maintains identity
8. **Jordan 1s (black/white) when shoes are visible** in cel-shaded/Simpsons style
9. **Always specify expression ID (E1–E6) and pose ID (P1–P6)** in every prompt

---

## What Dani Sells

Dani is positioned as a stylish, relatable Black woman in her mid-20s. She is the face of the page and presents every product as the page owner — whether that's a wellness supplement, a skincare product, a haircare item, or a fitness gadget.

**Natural fits:**
- Haircare (especially natural/curly hair products — she IS the target customer)
- Wellness/women's health supplements
- Skincare, beauty, collagen, SPF
- Fitness, active lifestyle, protein, pre-workout
- Lifestyle gadgets, home items
- Fashion/accessories

**For male-targeted products:** Dani presents these using a "found this for my man / brother / gym buddy" angle, or the deck uses a Simpsons-variant with a male character alongside Dani in a dialogue scene.
