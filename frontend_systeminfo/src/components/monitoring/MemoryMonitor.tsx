"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { useWebSocket } from "@/utils/WebSocketContext";

interface MemoryData {
    name: string
    value: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function MemoryMonitor() {
    const [memoryData, setMemoryData] = useState<MemoryData[]>([])
    const data = useWebSocket()

    useEffect(() => {
        if (data) {
            const total = 100 // Representamos el total como 100%
            const used = parseFloat(data.memoria)
            const free = total - used
            setMemoryData([
                { name: "Usado", value: used },
                { name: "Libre", value: free },
            ])
        }
    }, [data])

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-black">Monitoreo de Memoria</h2>
            <PieChart width={400} height={300}>
                <Pie
                    data={memoryData}
                    cx={200}
                    cy={150}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                >
                    {memoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    )
}

