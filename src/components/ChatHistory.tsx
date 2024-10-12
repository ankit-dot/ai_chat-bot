import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const ChatHistory = () => {
  return (
    <div className=" w-64 bg-white border-r sm:flex flex-col hidden border-gray-200">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Chat History</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-2">
          {[...Array(10)].map((_, i) => (
            <Button
              key={i}
              variant="ghost"
              className="w-full justify-start text-left mb-1"
            >
              Chat {i + 1}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
