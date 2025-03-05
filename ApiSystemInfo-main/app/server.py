import asyncio
import json
import websockets
from utils import get_system_resources

async def send_system_info(websocket, path=None):
    print(f"Conexión WebSocket establecida con {websocket.remote_address}")
    try:
        while True:
            resources = get_system_resources()
            cpu_freq_ghz = resources['cpu_freq'] / 1000 if resources['cpu_freq'] else None
            message = json.dumps({
                "cpu": f"{resources['cpu_percent']}%",
                "cpu_freq": f"{cpu_freq_ghz:.2f} GHz" if cpu_freq_ghz else None,
                "cpu_temp": f"{resources['cpu_temp']}°C" if resources['cpu_temp'] else None,
                "cpu_detallado": resources['cpu_detailed'],
                "memoria": f"{resources['memory_percent']}%",
                "memoria_detallada": resources['memory_detailed'], 
                "disco": f"{resources['disk_percent']}%",
                "red_enviados": f"{resources['net_bytes_sent'] / 1024:.2f} KB",
                "red_recibidos": f"{resources['net_bytes_recv'] / 1024:.2f} KB",
                "conexiones_red": resources['net_connections_count'],
                "detalles_conexiones": resources['net_connections_detail'], 
                "procesos": resources['processes']
            }, ensure_ascii=False)
            await websocket.send(message)
            await asyncio.sleep(1)
    except websockets.exceptions.ConnectionClosed:
        print(f"Cliente WebSocket {websocket.remote_address} desconectado.")

async def main():
    print("Servidor WebSocket iniciado en ws://localhost:8765")
    start_websocket_server = websockets.serve(send_system_info, '0.0.0.0', 8765)
    await start_websocket_server
    try:
        await asyncio.Future()  # Run forever
    except asyncio.CancelledError:
        print("Servidor detenido manualmente.")

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServidor detenido manualmente.")