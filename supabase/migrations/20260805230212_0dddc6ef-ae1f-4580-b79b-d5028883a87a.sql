UPDATE public.assignments SET
  title = 'Week 6 — Design Marketing Materials in Canva AI',
  platform = 'Canva AI',
  est_minutes = 68,
  difficulty = 'beginner',
  objectives = 'Use Canva AI to create professional marketing materials using the branding assets you created in previous assignments.',
  lesson = $json${
    "version": 1,
    "objective": "Use Canva AI to create professional marketing materials using the branding assets you created in previous assignments.",
    "estimatedMinutes": 68,
    "difficulty": "beginner",
    "overview": "Now that you've created a logo and promotional images, it's time to combine them into a professional marketing design.\n\nIn this assignment, you'll use Canva AI to create a flyer or social media graphic promoting your app. This design will also be used later in your marketing website and final presentation, helping keep your branding consistent across your entire project.",
    "successCriteria": [
      "A free Canva account created and a blank flyer design started",
      "Your logo and promotional images uploaded and balanced within the design",
      "Marketing text added: app name, short description, the problem your app solves, and a call-to-action",
      "Final design downloaded as a PNG and saved to your GitHub repository as MarketingGraphic"
    ],
    "steps": [
      {
        "id": "s1",
        "title": "Step 1: Sign In to Canva",
        "body": "1. Go to https://www.canva.com/ and create a free account.\n2. From the home page, select **Create a Design**.\n3. Choose **Flyer** and **Create a blank design**.\n4. Upload your logo and promotional images.\n5. Drop uploads into your design.\n6. Resize and move them until they look balanced."
      },
      {
        "id": "s2",
        "title": "Step 2: Add Your Marketing Text",
        "body": "Add:\n\n1. App name\n2. Short app description\n3. One sentence explaining the problem your app solves\n4. A short call-to-action. Examples: Learn More, Coming Soon, Stay Tuned, etc.\n\n**Call-to-action:** A sentence encouraging someone to take the next step."
      },
      {
        "id": "s3",
        "title": "Step 3: Download Your Marketing Graphic",
        "body": "1. Download your design as a PNG and save it in your GitHub Repository as: `MarketingGraphic`",
        "evidence": {
          "title": "Upload your final marketing graphic (PNG)",
          "required": true,
          "allowLinks": false,
          "maxFiles": 5,
          "reflectionRequired": false
        }
      }
    ],
    "checklist": [
      "Blank flyer design created in Canva",
      "Logo and promotional images uploaded and arranged",
      "App name, description, problem statement, and call-to-action added",
      "Design downloaded as a PNG and saved to GitHub as MarketingGraphic"
    ],
    "resources": [
      { "label": "Canva", "url": "https://www.canva.com/" }
    ]
  }$json$::jsonb
WHERE id = '67ef7587-6445-4b92-9864-642f8910539f';