import socket
import time
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils import get_system_resources

def start_server(host='0.0.0.0', port=9999):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server_socket.bind((host, port))
    server_socket.listen(1)
    print(f"Servidor escuchando en {host}:{port}...")

    while True:
        client_socket, addr = server_socket.accept()
        print(f"Conexión establecida con {addr}")
        try:
            while True:
                resources = get_system_resources()
                message = (
                    f"CPU: {resources['cpu_percent']}%, "
                    f"Memoria: {resources['memory_percent']}%, "
                    f"Disco: {resources['disk_percent']}%, "
                    f"Red (Enviados): {resources['net_bytes_sent'] / 1024:.2f} KB, "
                    f"Red (Recibidos): {resources['net_bytes_recv'] / 1024:.2f} KB, "
                    f"Conexiones de red: {resources['net_connections']}\n"
                )
                client_socket.send(message.encode('utf-8'))
                time.sleep(1)
        except (ConnectionResetError, BrokenPipeError):
            print(f"Cliente {addr} desconectado.")
        finally:
            try:
                client_socket.shutdown(socket.SHUT_RDWR)
            except OSError:
                pass
            client_socket.close()


if __name__ == "__main__":
    try:
        start_server()
    except KeyboardInterrupt:
        print("\nServidor detenido manualmente.")
