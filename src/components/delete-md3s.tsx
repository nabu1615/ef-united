import { client } from "@/sanity/lib/client";

async function deleteMd3s() {
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
    }

    console.log("All MD3s and their references have been deleted.");
  } catch (error) {
    console.error("Error deleting MD3s:", error);
  }
}

async function DeleteMatches() {
  try {
    const matches = await client.fetch('*[_type == "match"]');
    for (const match of matches) {
      await client.delete(match._id);
    }
    console.log("All matches have been deleted.");
  } catch (error) {
    console.error("Error deleting matches:", error);
  }
}

export default function DeleteMd3s() {
  return (
    <>
      <button onClick={deleteMd3s}>Delete MD3s</button>
      <button onClick={DeleteMatches}>Delete Matches</button>
    </>
  );
}
