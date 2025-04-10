"use client";

import { useParams } from "next/navigation";
import { useQuery, gql } from "@apollo/client";

const GET_FILE_CONTENT = gql`
  query GetFileContent($file_id: Int!) {
    getFileContent(file_id: $file_id)
  }
`;

export default function FilePage() {
  const { file_id } = useParams();
  const { data, loading, error } = useQuery(GET_FILE_CONTENT, {
    variables: { file_id: parseInt(file_id) },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const content = data?.getFileContent || [];

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">CSV Preview</h1>
      <div className="overflow-auto">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              {content[0]?.map((col, index) => (
                <th key={index} className="border px-4 py-2 text-left font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {content.slice(1).map((row, rIndex) => (
              <tr key={rIndex}>
                {row.map((cell, cIndex) => (
                  <td key={cIndex} className="border px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
