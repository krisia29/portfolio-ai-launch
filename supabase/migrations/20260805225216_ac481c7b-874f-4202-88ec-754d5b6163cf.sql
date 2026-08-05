UPDATE public.assignments SET
  title = 'Week 6 — Create Promotional Images',
  objectives = 'Create promotional images that showcase your mobile app and support your future marketing website and presentation.',
  platform = 'Adobe Firefly',
  est_minutes = 55,
  difficulty = 'beginner',
  status = 'published',
  lesson = $json${
    "version": 1,
    "objective": "Create promotional images that showcase your mobile app and support your future marketing website and presentation.",
    "estimatedMinutes": 55,
    "difficulty": "beginner",
    "overview": "Great apps need great visuals. Promotional images help people understand what your app is about before they even use it.\n\nIn this assignment, you'll use Adobe Firefly to create images that represent your app's purpose, audience, or benefits. These images will be used later in your Lovable marketing website, Gamma presentation, and GitHub Pages portfolio.",
    "successCriteria": [
      "Three promotional image ideas and prompts saved in your LogoDesign document",
      "Three different promotional images generated in Adobe Firefly, each captured as a screenshot",
      "Your best version of each image downloaded and saved to your GitHub repository with descriptive names"
    ],
    "steps": [
      {
        "id": "s1",
        "title": "Step 1: Review Your Brand",
        "body": "1. You will be creating 3 different promotional images. Your new images should match the style of your logo.\n2. Images generated should include: the app interface in action, features, and your target audience using your app.\n3. Save your three ideas and the prompts you will use to generate the images in your `LogoDesign` document before generating images."
      },
      {
        "id": "s2",
        "title": "Step 2: Write Your First Prompt",
        "body": "1. Describe the image clearly. Include subject, colors, mood, style, background, etc.\n\nExample:\n\n(Modern high school student using a learning app on a smartphone in a bright classroom, clean digital illustration, blue color palette, friendly atmosphere.)\n\n2. Repeat the process until you have created three different promotional images. Do not use identical prompts.\n3. Screenshot images generated.",
        "evidence": {
          "title": "Upload screenshots of your three generated promotional images",
          "required": true,
          "allowLinks": false,
          "reflectionRequired": false,
          "maxFiles": 5
        }
      },
      {
        "id": "s3",
        "title": "Step 3: Choose Your Favorites",
        "body": "1. Select your best version of each image.\n2. Download each selected image and save images to your GitHub Repository with a descriptive name. Example: `StudentUsingApp`"
      }
    ],
    "checklist": [
      "LogoDesign document updated with three promotional image ideas and prompts",
      "Screenshots of the three generated images uploaded",
      "Favorite version of each image downloaded and saved to GitHub with descriptive names"
    ],
    "resources": [
      { "label": "Adobe Firefly", "url": "https://firefly.adobe.com/" }
    ]
  }$json$::jsonb
WHERE id = 'cfbddf94-7e8e-4c6d-9649-3f78513d0738';