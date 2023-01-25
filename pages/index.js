import Head from "next/head";
import { useCallback, useState } from "react";
import styles from "./index.module.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const poemTypes = ["haiku", "limirick", "sonnet"];

export default function Home() {
  const [poemPrompt, setPoemPrompt] = useState("");
  const [selectedPoemType, setSelectedPoemType] = useState(poemTypes[0]);
  const [result, setResult] = useState();
  const onChangePoemType = useCallback(
    async (event) => {
      console.log('did it with', )
      await setSelectedPoemType(event.value);
      console.log('about to submit with', selectedPoemType)
      if (poemPrompt.length > 0) {
        onSubmit();
      }
    },
    [poemPrompt]
  );

  const onSubmit = useCallback(async (event) =>  {
    event && event.preventDefault();
    console.log({ selectedPoemType });
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ poemPrompt, poemType: selectedPoemType }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      console.log({ data });

      setResult(data.result);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }, [selectedPoemType, poemPrompt])

  return (
    <div className={styles.body}>
      <Head>
        <title>Poem Generator</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Poem Generator</h3>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}
        >
          Write me a{" "}
          <Dropdown
            className={styles.dropdown}
            style={{ marginLeft: "2px", marginRight: "2px" }}
            options={poemTypes}
            onChange={onChangePoemType}
            value={selectedPoemType}
            placeholder="Select an option"
          />
          about...
        </div>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Tell me anything my dear..."
            value={poemPrompt}
            onChange={(e) => setPoemPrompt(e.target.value)}
          />
          <input type="submit" value="Create poem" />
        </form>
        <div
          dangerouslySetInnerHTML={{
            __html: result ? result.replaceAll("\n", "<br />") : "",
          }}
          className={styles.result}
        />
      </main>
    </div>
  );
}
