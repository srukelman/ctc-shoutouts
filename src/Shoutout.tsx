import React, { useEffect, useState } from 'react';
import { Card, Text, CardHeader, Flex, Heading } from "@chakra-ui/react";
    
interface Shoutout {
    recipient: string;
    message: string;
    sender: string;
}

const ShoutoutReader: React.FC = () => {
    const [shoutouts, setShoutouts] = useState<Shoutout[]>([]);
    const [hidden, setHidden] = useState<Array<boolean>>([]);

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

    const removeNewlinesInQuotes = (input: string): string => {
        let res = "";
        let i = false;
        for (let x = 0; x < input.length; x++) {
            if(input[x] == "\""){
                i = !i;
            }
            if(input[x] == "\n" && i){
                res += '~';
                continue;
            }
            res += input[x];
        }
        return res;
    }

    const handleLines = (line: string) => {
        if(line.split(",").length == 4) {
            const [, recipient, message, sender] = line.split(",");
            return { recipient: recipient.replaceAll("\"", ""), message: message.replaceAll("\"", ""), sender: sender.replaceAll("\"", "") };
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
        return { recipient: res[0].replaceAll("\"", ""), message: res[1].replaceAll("\"", ""), sender: res[2].replaceAll("\"", "") };

    }

    const parseCSV = (text: string) => {
        text = removeNewlinesInQuotes(text);
        const rows = text.split("\n").slice(1);
        const res = rows.map(row => row.replaceAll("~", "\n"));
        const data: Shoutout[] = res.map(row => {
            return handleLines(row);
        }).filter(row => row.recipient && row.message && row.sender);
        setShoutouts(data);
        setHidden(Array(data.length).fill(false));
    };

    useEffect(() => {
    }, [shoutouts, hidden]);

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
                        <Card key={index} className="p-4 shadow-lg rounded-2xl" maxW = "sm" minW = "sm" border={"2px"} borderColor={"#a100ff"} borderRadius={"2xl"} opacity={"90%"} onClick={() => setHidden(hidden.map((val, i) => i === index ? !val : val))}>
                            {hidden[index] || <><CardHeader className="text-xl font-bold mb-2" color='#5000ff' fontWeight={"bold"} fontSize={"xl"} gap={2}>
                                {shoutout.recipient}
                            </CardHeader>
                            <Flex flexDirection={"column"} gap={4} alignItems={"space-between"} justifyContent={"space-between"} minH={40} margin={4}>
                                <Text>{shoutout.message}</Text>
                                <Text fontSize="xl" fontWeight={"bold"} color="#5000ff">-{shoutout.sender != "\r" ? shoutout.sender : 'Anonymous'}</Text>
                            </Flex></>}
                        </Card>
                    ))}
                </Flex>
            </div>
        </>
    );
};

export default ShoutoutReader;
