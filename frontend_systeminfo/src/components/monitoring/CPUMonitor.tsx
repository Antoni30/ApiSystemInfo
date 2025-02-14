"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { useWebSocket } from "@/utils/WebSocketContext"

interface CPUData {
    time: string
    usage: number
    temperature: number
    frequency: number
}

export default function CPUMonitor() {
    const [cpuData, setCpuData] = useState<CPUData[]>([])
    const data = useWebSocket()

    useEffect(() => {
        if (data) {
            setCpuData((prevData) => {
                const newData = [
                    ...prevData,
                    {
                        time: new Date().toLocaleTimeString(),
                        usage: parseFloat(data.cpu),
                        temperature: 0,
                        frequency: 0,
                    },
                ]
                return newData.slice(-10) // Mantener solo los últimos 10 puntos de datos
            })
        }
    }, [data])

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-black">Monitoreo de CPU</h2>
            <LineChart width={400} height={300} data={cpuData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="usage" stroke="#8884d8" name="Uso (%)" />
                <Line type="monotone" dataKey="temperature" stroke="#82ca9d" name="Temperatura (°C)" />
                <Line type="monotone" dataKey="frequency" stroke="#ffc658" name="Frecuencia (GHz)" />
            </LineChart>
        </div>
    )
}