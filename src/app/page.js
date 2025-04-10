"use client";
import Link from "next/link";
import { useQuery, gql } from "@apollo/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Settings, User, LogOut, Github } from "lucide-react";

const GET_SIDEBAR_DATA = gql`
  query {
    getWorkspaces {
      workspace_id
      name
    }
    getFolders {
      folder_id
      name
    }
    getFiles {
      file_id
      filename
    }
  }
`;

export default function HomePage() {
  const { data, loading, error } = useQuery(GET_SIDEBAR_DATA);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  const { getWorkspaces, getFolders, getFiles } = data;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r space-y-6 overflow-y-auto">
        <Accordion type="single" collapsible>
          {getWorkspaces.map((ws) => (
            <AccordionItem key={ws.workspace_id} value={ws.workspace_id.toString()}>
              <AccordionTrigger>{ws.name}</AccordionTrigger>
              <AccordionContent>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Folders</h4>
                  <ul className="space-y-1">
                    {getFolders.map((folder) => (
                      <li key={folder.folder_id} className="text-sm text-gray-700">
                        • {folder.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Data</h4>
                  <ul className="space-y-1">
                    {getFiles.map((file) => (
                      <li key={file.file_id} className="text-sm text-gray-700 hover:underline">
                        <Link href={`/files/${file.file_id}`}>
                          • {file.filename}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <Button variant="secondary" size="sm">
                  + Add Data Source
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <Input placeholder="Search..." className="w-1/3" />

          <div className="flex items-center space-x-4">
            <Button>+ New</Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Github className="mr-2 h-4 w-4" /> Github
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div>
          {/* Placeholder for future content */}
          <p className="text-muted-foreground">Select a folder or data source to begin.</p>
        </div>
      </main>
    </div>
  );
}