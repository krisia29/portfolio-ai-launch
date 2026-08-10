UPDATE assignments
SET platform = 'Canva AI',
    lesson = jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            lesson::jsonb,
            '{overview}',
            '"Great apps need great visuals. Promotional images help people understand what your app is about before they even use it.\n\nIn this assignment, you will use **Canva AI** (free version) to create images that represent your app''s purpose, audience, or benefits. These images will be used later in your Lovable marketing website, Gamma presentation, and GitHub Pages portfolio."'::jsonb
          ),
          '{resources}',
          '[{"label":"Canva AI (free)","url":"https://www.canva.com/ai/"}]'::jsonb
        ),
        '{steps,1,body}',
        '"1. In Canva, open the **Magic Media / AI image generator** tool and describe the image clearly. Include subject, colors, mood, style, background, etc.\n\nExample:\n\n(Modern high school student using a learning app on a smartphone in a bright classroom, clean digital illustration, blue color palette, friendly atmosphere.)\n\n2. Repeat the process in Canva AI until you have created three different promotional images. Do not use identical prompts.\n3. Screenshot images generated."'::jsonb
      ),
      '{successCriteria}',
      '["Three promotional image ideas and prompts saved in your LogoDesign document","Three different promotional images generated in Canva AI, each captured as a screenshot","Your best version of each image downloaded and saved to your GitHub repository with descriptive names"]'::jsonb
    )
WHERE id = 'cfbddf94-7e8e-4c6d-9649-3f78513d0738';