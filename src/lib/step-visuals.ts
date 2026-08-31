// Illustrated step graphics, keyed by assignment id -> zero-based step index.
// Rendered by <StepVisual /> under the matching lesson step to reduce text density.
import type { StepVisual } from "@/lib/lesson";

export const STEP_VISUALS: Record<string, Record<string, StepVisual>> =
{
  "6bb0622a-0c1d-4be7-a64e-a9c282faea00": {
    "1": {
      "kind": "flow",
      "title": "Creating a repository at a glance",
      "items": [
        {
          "icon": "github",
          "title": "New repository",
          "body": "Click + then New repository"
        },
        {
          "icon": "text",
          "title": "Name it",
          "body": "Use letters, numbers and dashes"
        },
        {
          "icon": "write",
          "title": "Describe it",
          "body": "One sentence about the project"
        },
        {
          "icon": "lock",
          "title": "Set visibility",
          "body": "Public shows your work; private stays hidden"
        },
        {
          "icon": "document",
          "title": "Add README",
          "body": "Check Add a README file"
        }
      ]
    },
    "4": {
      "kind": "cards",
      "title": "Public vs private",
      "items": [
        {
          "icon": "web",
          "title": "Public",
          "body": "Anyone can view it — good for portfolio work"
        },
        {
          "icon": "lock",
          "title": "Private",
          "body": "Only you can view it until you change it"
        }
      ]
    },
    "7": {
      "kind": "checklist",
      "title": "Before you submit",
      "items": [
        {
          "icon": "link",
          "title": "Copy the repository URL",
          "body": "From the address bar or the Code button"
        },
        {
          "icon": "review",
          "title": "Check it opens",
          "body": "Paste it in a new tab to confirm it loads"
        }
      ]
    }
  },
  "aa841efa-0f07-4d48-81eb-41a3d7c41ec3": {
    "1": {
      "kind": "cards",
      "title": "What each app idea should include",
      "items": [
        {
          "icon": "text",
          "title": "App name",
          "body": "Short and memorable"
        },
        {
          "icon": "target",
          "title": "Problem it solves",
          "body": "The real need behind the app"
        },
        {
          "icon": "users",
          "title": "Who uses it",
          "body": "Your main audience"
        },
        {
          "icon": "ai",
          "title": "How AI helps",
          "body": "The smart part of the app"
        },
        {
          "icon": "layers",
          "title": "Three features",
          "body": "The main things it can do"
        },
        {
          "icon": "star",
          "title": "Why it's useful",
          "body": "The value for real people"
        }
      ]
    },
    "2": {
      "kind": "checklist",
      "title": "How to judge your ideas",
      "items": [
        {
          "icon": "idea",
          "title": "Most interesting",
          "body": "Which one excites you?"
        },
        {
          "icon": "code",
          "title": "Fun to build",
          "body": "Which would you enjoy making?"
        },
        {
          "icon": "users",
          "title": "Helps real people",
          "body": "Which one solves a real problem?"
        },
        {
          "icon": "review",
          "title": "You understand it",
          "body": "Which features make sense to you?"
        }
      ]
    }
  },
  "0964a68b-b18d-4dc6-ba54-dfc59aab920a": {
    "2": {
      "kind": "flow",
      "title": "From idea to concept document",
      "items": [
        {
          "icon": "folder",
          "title": "Open past work",
          "body": "Your saved app idea"
        },
        {
          "icon": "chat",
          "title": "Prompt ChatGPT",
          "body": "Ask for a concept write-up"
        },
        {
          "icon": "document",
          "title": "Save the document",
          "body": "Name it clearly and keep it in one place"
        }
      ]
    }
  },
  "43f9105c-64bf-49c4-a514-f812be001819": {
    "1": {
      "kind": "cards",
      "title": "What a persona describes",
      "items": [
        {
          "icon": "users",
          "title": "Who they are",
          "body": "Age range, interests, daily routine"
        },
        {
          "icon": "target",
          "title": "What they need",
          "body": "The problem your app solves for them"
        },
        {
          "icon": "mobile",
          "title": "How they'd use it",
          "body": "When and where they open the app"
        }
      ]
    }
  },
  "54587b3b-4997-4cd0-b9fe-5b7b68bc113e": {
    "0": {
      "kind": "checklist",
      "title": "Documents to gather first",
      "items": [
        {
          "icon": "document",
          "title": "App concept document",
          "body": "From Week 2"
        },
        {
          "icon": "users",
          "title": "User personas",
          "body": "Who your app is for"
        },
        {
          "icon": "layers",
          "title": "Feature list",
          "body": "What your app can do"
        }
      ]
    }
  },
  "aeb71757-de61-4f9c-8a80-8e5110ff5e7b": {
    "1": {
      "kind": "cards",
      "title": "Comparing two versions",
      "items": [
        {
          "icon": "review",
          "title": "Clarity",
          "body": "Which is easier to understand?"
        },
        {
          "icon": "star",
          "title": "Excitement",
          "body": "Which makes you want the app?"
        },
        {
          "icon": "target",
          "title": "Accuracy",
          "body": "Which describes your app best?"
        }
      ]
    }
  },
  "eb5d0e96-4cda-4230-8553-eac388ec9062": {
    "0": {
      "kind": "flow",
      "title": "Refining features with Claude",
      "items": [
        {
          "icon": "layers",
          "title": "Share your list",
          "body": "Paste your current features"
        },
        {
          "icon": "ai",
          "title": "Ask for feedback",
          "body": "Which are essential? Which can wait?"
        },
        {
          "icon": "checklist",
          "title": "Pick your final set",
          "body": "Keep the features you can explain"
        }
      ]
    }
  },
  "074e09ee-0881-43e8-8818-1c897a64bbd2": {
    "0": {
      "kind": "flow",
      "title": "Your research workflow",
      "items": [
        {
          "icon": "bot",
          "title": "Open Gemini",
          "body": "Sign in with a free account"
        },
        {
          "icon": "folder",
          "title": "Name the notebook",
          "body": "Use your app name"
        },
        {
          "icon": "research",
          "title": "Add sources",
          "body": "Articles and notes about your topic"
        },
        {
          "icon": "chat",
          "title": "Ask questions",
          "body": "Let Gemini summarize what you found"
        },
        {
          "icon": "save",
          "title": "Save your notes",
          "body": "Keep them with your project files"
        }
      ]
    }
  },
  "5cfa7a9a-569b-4a75-a5b8-7d420c86a5ed": {
    "1": {
      "kind": "cards",
      "title": "What belongs in an insight report",
      "items": [
        {
          "icon": "idea",
          "title": "Key findings",
          "body": "Three to five things you learned"
        },
        {
          "icon": "users",
          "title": "What users need",
          "body": "Patterns you noticed"
        },
        {
          "icon": "target",
          "title": "What it means for your app",
          "body": "Changes you'll make"
        }
      ]
    }
  },
  "081652c5-ecf1-4bea-aefa-d1f368e8627e": {
    "2": {
      "kind": "checklist",
      "title": "Editing the summary",
      "items": [
        {
          "icon": "write",
          "title": "Use your own words",
          "body": "Rewrite anything that sounds copied"
        },
        {
          "icon": "review",
          "title": "Check the facts",
          "body": "Remove claims you can't support"
        },
        {
          "icon": "privacy",
          "title": "Keep it private",
          "body": "No personal or school-identifying details"
        }
      ]
    }
  },
  "f4269f0a-c47c-4dec-b7cd-0cdb6ccd7238": {
    "3": {
      "kind": "flow",
      "title": "Building your mind map",
      "items": [
        {
          "icon": "write",
          "title": "Paste your prompt",
          "body": "Your app summary and features"
        },
        {
          "icon": "magic",
          "title": "Generate",
          "body": "Let NapkinAI draw the visual"
        },
        {
          "icon": "review",
          "title": "Improve it",
          "body": "Regenerate or edit labels"
        },
        {
          "icon": "download",
          "title": "Export",
          "body": "Save as PNG"
        }
      ]
    }
  },
  "5685b32e-4c49-457e-87bc-ad542bb66049": {
    "1": {
      "kind": "flow",
      "title": "A simple user journey",
      "items": [
        {
          "icon": "mobile",
          "title": "Opens the app",
          "body": "First screen they see"
        },
        {
          "icon": "compass",
          "title": "Finds a feature",
          "body": "How they get where they're going"
        },
        {
          "icon": "ai",
          "title": "Uses AI help",
          "body": "The moment the app helps them"
        },
        {
          "icon": "star",
          "title": "Gets a result",
          "body": "The goal they came for"
        }
      ]
    }
  },
  "2f005f69-492e-40c4-b5e9-fb764e5b3e22": {
    "2": {
      "kind": "checklist",
      "title": "Check your workflow diagram",
      "items": [
        {
          "icon": "workflow",
          "title": "Steps in order",
          "body": "Each box leads to the next"
        },
        {
          "icon": "text",
          "title": "Short labels",
          "body": "A few words per box"
        },
        {
          "icon": "review",
          "title": "No missing screens",
          "body": "Nothing skipped between steps"
        }
      ]
    }
  },
  "1b40ad7a-2d2f-4c3b-8adc-cb81cf8b27cc": {
    "2": {
      "kind": "cards",
      "title": "What makes a prompt better",
      "items": [
        {
          "icon": "palette",
          "title": "Style",
          "body": "Flat, minimal, hand-drawn"
        },
        {
          "icon": "layers",
          "title": "Subject",
          "body": "The object or symbol you want"
        },
        {
          "icon": "text",
          "title": "Colors",
          "body": "Two or three brand colors"
        }
      ]
    }
  },
  "cfbddf94-7e8e-4c6d-9649-3f78513d0738": {
    "0": {
      "kind": "cards",
      "title": "Your brand basics",
      "items": [
        {
          "icon": "palette",
          "title": "Colors",
          "body": "The two or three you'll reuse"
        },
        {
          "icon": "type",
          "title": "Fonts",
          "body": "One for headings, one for text"
        },
        {
          "icon": "image",
          "title": "Logo",
          "body": "Your chosen mark from Firefly"
        }
      ]
    }
  },
  "67ef7587-6445-4b92-9864-642f8910539f": {
    "1": {
      "kind": "flow",
      "title": "Finishing a graphic in Canva",
      "items": [
        {
          "icon": "image",
          "title": "Add your image",
          "body": "Upload your AI artwork"
        },
        {
          "icon": "text",
          "title": "Add your text",
          "body": "App name and one short line"
        },
        {
          "icon": "palette",
          "title": "Match your brand",
          "body": "Reuse your colors and fonts"
        },
        {
          "icon": "download",
          "title": "Download",
          "body": "Export as PNG"
        }
      ]
    }
  },
  "34ef6426-fe99-4f95-ac90-6e8e6c23e6cc": {
    "1": {
      "kind": "flow",
      "title": "Prototyping with Replit Agent",
      "items": [
        {
          "icon": "code",
          "title": "Open Replit",
          "body": "Sign in with a free account"
        },
        {
          "icon": "chat",
          "title": "Describe your app",
          "body": "Paste your app summary and features"
        },
        {
          "icon": "magic",
          "title": "Let the Agent build",
          "body": "Wait for the first version"
        },
        {
          "icon": "review",
          "title": "Review the result",
          "body": "Check screens against your plan"
        },
        {
          "icon": "save",
          "title": "Save your project",
          "body": "Keep the project link"
        }
      ]
    }
  },
  "813ec9d3-2290-44e8-acee-41a67d953f84": {
    "2": {
      "kind": "checklist",
      "title": "Testing your navigation",
      "items": [
        {
          "icon": "link",
          "title": "Every link works",
          "body": "No dead buttons"
        },
        {
          "icon": "mobile",
          "title": "Mobile view",
          "body": "Nothing cut off on a phone screen"
        },
        {
          "icon": "compass",
          "title": "Easy to find",
          "body": "You can reach each screen in one or two taps"
        }
      ]
    }
  },
  "31aca571-fef6-4b84-b807-6def93eb61e9": {
    "1": {
      "kind": "cards",
      "title": "Choosing one improvement",
      "items": [
        {
          "icon": "text",
          "title": "Clearer text",
          "body": "Make the headline easy to understand"
        },
        {
          "icon": "palette",
          "title": "Better visuals",
          "body": "Match your brand colors"
        },
        {
          "icon": "rocket",
          "title": "Stronger call to action",
          "body": "Tell visitors what to do next"
        }
      ]
    }
  },
  "9a7306ea-5c82-4ec5-9d20-7d58b382a85f": {
    "2": {
      "kind": "chevrons",
      "title": "Team roles",
      "items": [
        {
          "icon": "target",
          "title": "Product Lead",
          "body": "Keeps the team focused on the product's problem, audience, solution, features, and vision."
        },
        {
          "icon": "compass",
          "title": "Hero and Navigation Lead",
          "body": "Organizes and reviews the hero section, app name, tagline, call-to-action, and navigation."
        },
        {
          "icon": "idea",
          "title": "Problem, Solution, Features Lead",
          "body": "Organizes and reviews the problem, solution, and features sections of the website."
        },
        {
          "icon": "workflow",
          "title": "How It Works Lead",
          "body": "Organizes and reviews the how it works section, app preview, screenshots, and user workflow."
        },
        {
          "icon": "share",
          "title": "About and CTA Lead",
          "body": "Organizes and reviews the about section, final call-to-action, team purpose, and visitor next steps."
        }
      ]
    },
    "4": {
      "kind": "checklist",
      "title": "Your role assignment table",
      "items": [
        {
          "icon": "users",
          "title": "Student name",
          "body": "One row per team member"
        },
        {
          "icon": "target",
          "title": "Role",
          "body": "The lead role they chose"
        },
        {
          "icon": "layers",
          "title": "Website section",
          "body": "The section they will own"
        }
      ]
    }
  },
  "9fa501c7-4091-456a-b02b-cc9592c72007": {
    "1": {
      "kind": "flow",
      "title": "Preparing the team master prompt",
      "items": [
        {
          "icon": "folder",
          "title": "Gather materials",
          "body": "Concept, features, and images"
        },
        {
          "icon": "write",
          "title": "Fill the template",
          "body": "Replace every placeholder"
        },
        {
          "icon": "magic",
          "title": "Generate the site",
          "body": "Paste the prompt into Lovable"
        },
        {
          "icon": "review",
          "title": "Spot improvements",
          "body": "Pick your top three"
        }
      ]
    }
  },
  "867feaad-d3df-4605-99ae-b142515dc737": {
    "1": {
      "kind": "checklist",
      "title": "Testing checklist",
      "items": [
        {
          "icon": "link",
          "title": "Links work",
          "body": "Every button goes somewhere"
        },
        {
          "icon": "desktop",
          "title": "Desktop layout",
          "body": "Sections line up neatly"
        },
        {
          "icon": "mobile",
          "title": "Mobile layout",
          "body": "Text and images fit the screen"
        },
        {
          "icon": "privacy",
          "title": "Privacy check",
          "body": "No personal or school-identifying details"
        }
      ]
    },
    "4": {
      "kind": "flow",
      "title": "Publishing your site",
      "items": [
        {
          "icon": "rocket",
          "title": "Publish",
          "body": "Use the Publish button"
        },
        {
          "icon": "web",
          "title": "Open the live link",
          "body": "Check it loads in a new tab"
        },
        {
          "icon": "link",
          "title": "Submit the URL",
          "body": "Add it to your assignment"
        }
      ]
    }
  },
  "a1886a36-6db6-4b96-ba55-83e6430114da": {
    "0": {
      "kind": "checklist",
      "title": "Materials to gather",
      "items": [
        {
          "icon": "document",
          "title": "App concept",
          "body": "Problem, solution, audience"
        },
        {
          "icon": "layers",
          "title": "Feature list",
          "body": "What your app does"
        },
        {
          "icon": "image",
          "title": "Logo and graphics",
          "body": "From Week 6"
        },
        {
          "icon": "mobile",
          "title": "Prototype screenshots",
          "body": "From Week 7"
        }
      ]
    },
    "3": {
      "kind": "cards",
      "title": "Slides your pitch needs",
      "items": [
        {
          "icon": "target",
          "title": "The problem",
          "body": "Who struggles and why"
        },
        {
          "icon": "idea",
          "title": "Your solution",
          "body": "What your app does"
        },
        {
          "icon": "layers",
          "title": "Key features",
          "body": "Three highlights"
        },
        {
          "icon": "mobile",
          "title": "Prototype",
          "body": "Screenshots of your app"
        },
        {
          "icon": "palette",
          "title": "Branding",
          "body": "Logo, colors, marketing image"
        },
        {
          "icon": "rocket",
          "title": "What's next",
          "body": "Your closing ask"
        }
      ]
    }
  }
};

export function getStepVisual(assignmentId: string, stepIndex: number): StepVisual | undefined {
  return STEP_VISUALS[assignmentId]?.[String(stepIndex)];
}
