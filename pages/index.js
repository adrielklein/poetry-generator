import Head from "next/head";
import { useCallback, useMemo, useState } from "react";
import styles from "./index.module.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const poemTypes = ["haiku", "limirick", "sonnet"];

export default function Home() {
  const [poemPrompt, setPoemPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPoemType, setSelectedPoemType] = useState(poemTypes[0]);
  const [poem, setPoem] = useState();
  const onChangePoemType = useCallback(
    async (event) => {
      console.log("did it with", event.value);
      setSelectedPoemType(event.value);

      console.log("about to submit with", event.value);
      if (poemPrompt.length > 0) {
        generatePoem({ prompt: poemPrompt, type: event.value });
      }
    },
    [poemPrompt]
  );

  const generatePoem = useCallback(
    async ({ prompt, type }) => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ poemPrompt: prompt, poemType: type }),
        });

        const data = await response.json();
        if (response.status !== 200) {
          throw (
            data.error ||
            new Error(`Request failed with status ${response.status}`)
          );
        }
        console.log({ data });

        setPoem(data.result);
        setIsLoading(false);
      } catch (error) {
        // Consider implementing your own error handling logic here
        console.error(error);
        alert(error.message);
        setIsLoading(false);
      }
    },
    [setPoem, setIsLoading]
  );

  const onSubmit = useCallback(
    async (event) => {
      event && event.preventDefault();
      console.log({ selectedPoemType });
      generatePoem({ prompt: poemPrompt, type: selectedPoemType });
    },
    [selectedPoemType, poemPrompt]
  );
  // Color pallette
  // return (
  //   <div>
  //     <div style={{ height: "100px", width: "100px", background: '#F7F7F7' }} />
  //     <div style={{ height: "100px", width: "100px", background: '#333333' }} />
  //     <div style={{ height: "100px", width: "100px", background: '#2C3E50' }} />
  //     <div style={{ height: "100px", width: "100px", background: '#5C3D91' }} />
  //     <div style={{ height: "100px", width: "100px", background: '#F5A9A9' }} />
  //   </div>
  // );
  const text = useMemo(() => {
    if (isLoading) {
      return "Loading...";
    }
    return poem ? poem.replaceAll("\n", "<br />") : "";
  }, [isLoading, poem]);

  return (
    <div className={styles.body}>
      <Head>
        <title>Poem Generator</title>
        <link rel="icon" href="/logo.png" />
      </Head>

      <main className={styles.main}>
        <img src="/logo.png" className={styles.icon} />
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
            placeholder=""
            value={poemPrompt}
            onChange={(e) => setPoemPrompt(e.target.value)}
          />
          <input type="submit" value="Create poem" />
        </form>
        <div
          dangerouslySetInnerHTML={{
            __html: text,
          }}
          className={styles.result}
        />
      </main>
    </div>
  );
}
