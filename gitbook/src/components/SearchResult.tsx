import type { DocNode } from "@/types";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import handleSelect from "@/lib/handleselect";
import type { Dispatch, SetStateAction } from "react";
import { DialogClose } from "./ui/dialog";

interface SearchResultInterface {
    query: string;
    data: DocNode;
    setter: Dispatch<SetStateAction<string>>;
}

export default function SearchResult({ query, data, setter }: SearchResultInterface) {
    // Normalize query and remove line breaks and special characters
    const normalizedQuery = query.toLowerCase().replace(/[#\n]/g, '');

    // Function to check if query matches filename or content
    const matchesQuery = (text: string) =>
        text.toLowerCase().replace(/[#\n]/g, '').includes(normalizedQuery);

    return (<ScrollArea>
        {data.files.map((file, index) => (
            matchesQuery(file.filename) || matchesQuery(file.content) ?
                <ResultItem
                    path={file.filename == "index.md" ? data.path  : `${data.path}/${file.filename.split(".")[0]}`}
                    key={`${data.path}-file-${index}`}
                    title={file.filename}
                    content={file.content}
                    setter={setter}
                /> : null
        ))}
        {data.children.map((childNode, index) => (
            <SearchResult
                key={`${data.path}-child-${index}`}
                query={query}
                data={childNode}
                setter={setter}
            />
        ))}
    </ScrollArea>);
}

interface ResultItemInterface {
    path: string;
    title: string;
    content: string;
    setter: Dispatch<SetStateAction<string>>;
}

export const ResultItem = ({ path, title, content, setter }: ResultItemInterface) => {
    return (
        <DialogClose asChild>
            <Card onClick={() => { handleSelect(path, setter); }} className="mb-2">
                <CardHeader>
                    <CardTitle>{title == "index.md" ? path ==  "/" ? "Home" : path.split("/")[path.split("/").length -1] : title.split(".")[0]}</CardTitle>
                    <CardDescription className="line-clamp-1">{content.replace(/^#+\s*/, "")}</CardDescription>
                </CardHeader>
            </Card>
        </DialogClose>
    );
}