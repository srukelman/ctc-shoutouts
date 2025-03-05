import React, { useState } from 'react';
import { Card, Text, CardHeader, Flex, Heading } from "@chakra-ui/react";

    
interface Shoutout {
    recipient: string;
    message: string;
    sender: string;
}

const ShoutoutReader: React.FC = () => {
    const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                parseCSV(text);
            };
            reader.readAsText(file);
        }
    };
    
    const handleLines = (line: string) => {
        if(line.split(",").length == 4) {
            const [, recipient, message, sender] = line.split(",");
            return { recipient, message, sender };
        }
        const res = ["", "", ""];
        line = line.split(",").slice(1).join(",");
        let i = false;
        let j = 0;
        for (let x = 0; x < line.length; x++) {
            if(line[x] == "," && !i){
                j++;
                continue;
            }
            if(line[x] == "\""){
                i = !i;
                continue;
            }
            res[j] += line[x];
        }
        return { recipient: res[0], message: res[1], sender: res[2] };

    }

    const parseCSV = (text: string) => {
        const rows = text.split("\n").slice(1);
        const data: Shoutout[] = rows.map(row => {
            return handleLines(row);
        }).filter(row => row.recipient && row.message && row.sender);
        console.log(data);
        setShoutouts(data);
    };

    return (
        <>
            <Flex position={"fixed"} top={0} left={0} right={0} bg={"#f8f8ff"} zIndex={1} justifyContent={"center"} alignItems={"center"} minH={20}>
                <Heading fontSize="5xl" color="#5000ff" position={"sticky"}>SHOUTOUTS</Heading>
            </Flex>
            
            {shoutouts.length > 0 &&
                <>
                    <img src="ctclogo.svg" alt="CTC Logo" style={{position: "fixed", left: "100%", top: "50%", transform: "translate(-50%, -50%)", height: "60%", opacity: "75%"}}/>
                    <img src="ctclogo.svg" alt="CTC Logo" style={{position: "fixed", left: "0%", top: "50%", transform: "translate(-50%, -50%)", height: "60%", opacity: "75%"}}/>
                </>
            }
            <div className="p-6">
                {shoutouts.length > 0 || 
                <Flex wrap="wrap" gap={4} justify="center" flexDirection={"row"} marginTop={50}><input type="file" accept=".csv" onChange={handleFileUpload} className="mb-4" /></Flex>
                    
                }
                <Flex wrap="wrap" gap={4} justify="center" flexDirection={"row"} marginTop={50}>
                    {shoutouts.map((shoutout, index) => (
                        <Card key={index} className="p-4 shadow-lg rounded-2xl" maxW = "sm" minW = "sm" border={"2px"} borderColor={"#a100ff"} borderRadius={"2xl"} opacity={"90%"}>
                            <CardHeader className="text-xl font-bold mb-2" color='#5000ff' fontWeight={"bold"} fontSize={"xl"} gap={2}>
                                {shoutout.recipient}
                            </CardHeader>
                            <Flex flexDirection={"column"} gap={4} alignItems={"space-between"} justifyContent={"space-between"} minH={40} margin={4}>
                                <Text>{shoutout.message}</Text>
                                <Text fontSize="xl" fontWeight={"bold"} color="#5000ff">-{shoutout.sender != "\r" ? shoutout.sender : 'Anonymous'}</Text>
                            </Flex>
                        </Card>
                    ))}
                </Flex>
            </div>
        </>
    );
};

export default ShoutoutReader;
