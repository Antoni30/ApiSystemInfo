"use client"

import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useWebSocket } from "@/utils/WebSocketContext";

const COLORS = ["#0088FE", "#00C49F"]

export default function DiskMonitor() {
    const [diskData, setDiskData] = useState([
        { name: "Usado", value: 0 },
        { name: "Libre", value: 0 },
    ])
    const data = useWebSocket()

    useEffect(() => {
        if (data) {
            const total = 100 // Representamos el total como 100%
            const used = parseFloat(data.disco)
            const free = total - used
            setDiskData([
                { name: "Usado", value: used },
                { name: "Libre", value: free },
            ])
        }
    }, [data]) 

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-black">Monitoreo de Disco</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={diskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {diskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
            <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Espacio Total: 1TB</p>
                <p className="text-sm font-medium text-gray-500">
                    Espacio Usado: {diskData[0].value.toFixed(2)} GB ({((diskData[0].value / 1000) * 100).toFixed(2)}%)
                </p>
                <p className="text-sm font-medium text-gray-500">
                    Espacio Libre: {diskData[1].value.toFixed(2)} GB ({((diskData[1].value / 1000) * 100).toFixed(2)}%)
                </p>
            </div>
        </div>
    )
}

