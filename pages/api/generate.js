import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  console.log('doing it')
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const poemPrompt = req.body.poemPrompt || "";
  if (poemPrompt.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid poemPrompt",
      },
    });
    return;
  }

  const poemType = req.body.poemType || "";
  if (poemType.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a poem type",
      },
    });
    return;
  }


  try {
    console.log('helloooo', poemType)
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt({poemPrompt, poemType}),
      temperature: 0.6,
      max_tokens: 400,
    });
    console.log('result', completion.data.choices)
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt({poemPrompt, poemType}) {
  console.log('got to the poem type', poemType)
  return `Write me a ${poemType} limerick about ${poemPrompt}`;
}
