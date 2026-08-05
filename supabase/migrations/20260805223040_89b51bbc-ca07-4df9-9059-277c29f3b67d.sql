update public.assignments set
  title = 'Week 6 — Design an App Logo with Adobe Firefly',
  objectives = 'Create a professional logo for your mobile app using the free AI image generation tools available in Adobe Firefly.',
  est_minutes = 55,
  difficulty = 'beginner',
  created_at = '2026-07-06 20:09:08.100000+00',
  lesson = $json$
{
  "version": 1,
  "objective": "Create a professional logo for your mobile app using the free AI image generation tools available in Adobe Firefly.",
  "estimatedMinutes": 55,
  "difficulty": "beginner",
  "overview": "Every successful app has a recognizable brand. One of the most important branding elements is a logo. A logo helps people remember your app and communicates its purpose at a glance.\n\nIn previous assignments, you researched your idea, improved your app description, identified your target users, and created planning diagrams. Now you'll begin creating the visual identity for your project by designing your first logo using Adobe Firefly's free AI image generator.",
  "successCriteria": [
    "A saved LogoDesign document containing your original and improved prompts",
    "Two sets of generated logo concepts, each captured as a screenshot",
    "One selected final logo downloaded and saved to your GitHub repository"
  ],
  "steps": [
    {
      "id": "s1",
      "title": "Step 1: Open Adobe Firefly",
      "body": "1. Go to [https://firefly.adobe.com/](https://firefly.adobe.com/) and create a free account.\n2. Once signed in, choose the option to create an image from text.\n3. In a new Word Document, describe the type of logo you want. This will be your prompt to generate your logo. Save this document as: `LogoDesign`\n\nWhen writing your prompt:\n\n- Keep your prompt between 30–80 words.\n- Mention colors, style, symbols or icons, and specify that you want a clean, modern logo.\n\nExample prompt:\n\n(Modern flat logo for a mobile app called StudySpark. Blue and green color palette. Friendly, simple, clean design with a graduation cap and lightning bolt. Minimalist vector style on a white background.)\n\n4. Save your completed prompt then paste it into Adobe Firefly to generate the image.",
      "evidence": {
        "title": "Upload your LogoDesign document with your first prompt",
        "required": true,
        "allowLinks": false,
        "reflectionRequired": false
      }
    },
    {
      "id": "s2",
      "title": "Step 2: Generate Logo Ideas",
      "body": "1. Click the **Generate** button. Adobe Firefly will create several logo concepts.\n2. Screenshot the generated images and decide which aligns most with your vision.",
      "evidence": {
        "title": "Upload a screenshot of your first set of generated logos",
        "required": true,
        "allowLinks": false,
        "reflectionRequired": false
      }
    },
    {
      "id": "s3",
      "title": "Step 3: Improve Your Prompt",
      "body": "1. Update your prompt by adding more details. Such as brighter colors, simpler design, thicker lines, modern style, etc.\n2. In the same document, save your updated prompt before generating another set of logos.\n3. Compare your new results with the first version.\n4. Screenshot the second set of generated images.",
      "evidence": {
        "title": "Upload a screenshot of your second set of generated logos",
        "required": true,
        "allowLinks": false,
        "reflectionRequired": false
      }
    },
    {
      "id": "s4",
      "title": "Step 4: Select Your Favorite Logo",
      "body": "1. Choose the logo that best represents your app.\n2. Download your selected image and save to your GitHub repository along with your `LogoDesign` document."
    }
  ],
  "checklist": [
    "LogoDesign document saved with both prompts",
    "Screenshot of first set of generated logos uploaded",
    "Screenshot of second set of generated logos uploaded",
    "Final logo downloaded and saved to your GitHub repository"
  ],
  "resources": [
    { "label": "Adobe Firefly", "url": "https://firefly.adobe.com/" }
  ]
}
$json$::jsonb
where id = '1b40ad7a-2d2f-4c3b-8adc-cb81cf8b27cc';