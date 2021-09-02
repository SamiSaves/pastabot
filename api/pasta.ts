import { NowRequest, NowResponse } from "@vercel/node";
import { promises as fs } from "fs";
import got from "got/dist/source";

const isValidQuery = (query: string | string[]): query is string => typeof query === "string";
const isValidPasta = (pastas: string[], pasta: string) => pastas.includes(pasta);
const createSlackMessage = (pasta: string) => ({
  blocks: [
    {
      type: "section",
      text: {
        type: "plain_text",
        text: pasta,
      },
    },
  ],
});

export default async (request: NowRequest, response: NowResponse) => {
  const { text: pastaQuery, user_name} = request.query;
  const pastas = (await fs.readdir(`${__dirname}/../pastas`)).map((fileName) => fileName.replace(/\.[^/.]+$/, ""));
  if (isValidQuery(pastaQuery)) {
    if (isValidPasta(pastas, pastaQuery)) {
      try {
        const pastaFile = await fs.readFile(`${__dirname}/../pastas/${pastaQuery}.txt`, { encoding: "utf-8" });
        await got((process.env.WEBHOOK_URL as string), {method: 'POST', body: JSON.stringify({pasta: pastaFile + `\n\nTerveisin: ${user_name}`})})
        return response.status(200).send('')
      } catch (error) {
        return response.status(500).send(error.message);
      }
    } else {
      return response
        .status(200)
        .send(`Couldn't find that pasta. Please use one of the following: ${pastas.join(", ")}`);
    }
  } else {
  }
  response.status(400).send("Invalid query parameter. Allowed query parameters are: text");
};
