import { createClient } from "next-sanity";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  useCdn: false,
});

const deleteMd3s = async () => {
  try {
    // Fetch all MD3 documents
    const md3s = await client.fetch('*[_type == "md3"]');

    for (const md3 of md3s) {
      // Remove references from Match documents
      await client.patch(md3._id).unset(["matches"]).commit();

      // Remove references from Person documents
      const persons = await client.fetch(
        `*[_type == "person" && references("${md3._id}")]`
      );
      for (const person of persons) {
        await client
          .patch(person._id)
          .unset([`md3s[_ref == "${md3._id}"]`])
          .commit();
      }

      // Delete the MD3 document
      await client.delete(md3._id);
      console.log(`Deleted MD3: ${md3._id}`);
    }

    console.log("All MD3s and their references have been deleted.");
  } catch (error) {
    console.error("Error deleting MD3s:", error);
  }
};

const deleteMatches = async () => {
  try {
    const matches = await client.fetch('*[_type == "match"]');

    for (const match of matches) {
      await client.delete(match._id);
    }
    console.log("All matches have been deleted.");
  } catch (error) {
    console.error("Error deleting matches:", error);
  }
};

export { deleteMd3s, deleteMatches };
