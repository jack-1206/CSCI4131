#!/usr/bin/env python3
# See https://docs.python.org/3.2/library/socket.html
# for a decscription of python socket and its parameters
import socket
# add the following modules, so we can refactor EchoServer into HTTP HEAD Server
import os
import stat
import sys
import urllib.parse
import datetime
from threading import Thread
from argparse import ArgumentParser

BUFSIZE = 4096

# add the following
CRLF = '\r\n'
METHOD_NOT_ALLOWED = 'HTTP/1.1 405 METHOD NOT ALLOWED{}Allow: GET, HEAD, POST{}Connection: close{}{}'.format(CRLF, CRLF,
                                                                                                             CRLF, CRLF)
OK = 'HTTP/1.1 200 OK{}{}{}'.format(CRLF, CRLF, CRLF)  # head request only
NOT_FOUND = 'HTTP/1.1 404 NOT FOUND{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)
FORBIDDEN = 'HTTP/1.1 403 FORBIDDEN{}Connection: close{}{}'.format(CRLF, CRLF, CRLF)


# head requests, get contents of text or html files
def get_contents(fname):
    with open(fname, 'r') as f:
        return f.read()


# check file permissions - is file world readable?
def check_perms(resource):
    # """Returns True if resource has read permissions set on 'others'"""
    stmode = os.stat(resource).st_mode
    return (getattr(stat, 'S_IROTH') & stmode) > 0


class HTTP_HeadServer:
    def __init__(self, host, port):
        print("Server")
        print('listening on port {}'.format(port))
        self.host = host
        self.port = port

        self.setup_socket()
        self.accept()
        self.sock.shutdown()
        self.sock.close()

    def setup_socket(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind((self.host, self.port))
        self.sock.listen(128)

    def accept(self):
        while True:
            (client, address) = self.sock.accept()
            # th = Thread(target=client_talk, args=(client, address))
            th = Thread(target=self.accept_request, args=(client, address))
            th.start()

    # here, we add a function belonging to the class HTTP_HeadServer to accept
    # and process a request
    def accept_request(self, client_sock, client_addr):
        print("accept request")
        data = client_sock.recv(BUFSIZE)
        req = data.decode('utf-8')  # returns a string
        response = self.process_request(req)  # returns a string

        # once we get a response, we chop it into utf encoded bytes
        # and send it (like EchoClient)
        client_sock.send(response)
        # clean up the connection to the client
        # but leave the server socket for recieving requests open
        client_sock.shutdown(1)
        client_sock.close()

    # added method to process requests, only head is handled in this code
    def process_request(self, request):
        print('######\nREQUEST:\n{}######'.format(request))
        linelist = request.strip().split(CRLF)
        reqline = linelist[0]
        rlwords = reqline.split()
        if len(rlwords) == 0:
            return ''
        if rlwords[0] == 'HEAD':
            resource = rlwords[1][1:]  # skip beginning eg. index.html
            return self.head_request(resource)
        elif rlwords[0] == 'GET':
            resource = rlwords[1][1:]
            return self.get_request(resource)
        elif rlwords[0] == 'POST':
            resource = linelist[-1]
            return self.post_request(resource)
        else:  # add ELIF checks for GET and POST before this else..
            return METHOD_NOT_ALLOWED

    def head_request(self, resource):
        """Handles HEAD requests."""
        path = os.path.join('.', resource)  # look in directory where server is running
        if not os.path.exists(resource):
            ret = NOT_FOUND
        elif not check_perms(resource):
            ret = FORBIDDEN
        else:
            ret = OK
        return ret.encode('utf-8')

    def get_request(self, resource):
        """Handles GET requests."""
        if "redirect?query_string=" in resource:
            search_query = resource.split('=')[1]
            redirect = 'HTTP/1.1 307 TEMPORARY REDIRECT\n' + 'Location: https://www.youtube.com/results?search_query=' + search_query + '\n\nConnection: close'
            print(redirect)
            return redirect.encode('utf-8')
        path = os.path.join('.', resource)  # look in directory where server is running
        ret = ""
        if not os.path.exists(resource):
            with open("404.html") as f:
                content = f.read()
            ret = (NOT_FOUND + content).encode('utf-8')
        elif not check_perms(resource):
            with open("403.html") as f:
                content = f.read()
            ret = (FORBIDDEN + content).encode('utf-8')
        else:
            filetype = resource.split('.')[1]  # ["index", "html"]
            if filetype == "html":
                with open(resource, 'r') as f:
                    content = f.read()
                ret = (OK + content).encode('utf-8')

            elif filetype == "png":
                with open(resource, 'rb') as f:
                    content = f.read()
                ret = bytes('HTTP/1.1 200 OK\n' + "Content-Type: image/png\n\n", 'utf-8') + content
            elif filetype == "jpg":
                with open(resource, 'rb') as f:
                    content = f.read()
                ret = bytes('HTTP/1.1 200 OK\n' + "Content-Type: image/jpg\n\n", 'utf-8') + content
            elif filetype == "mp3":
                with open(resource, 'rb') as f:
                    content = f.read()
                ret = bytes('HTTP/1.1 200 OK\n' + "Content-Type: audio/mpeg\n\n", 'utf-8') + content
            elif filetype == "css":
                with open(resource, 'rb') as f:
                    content = f.read()
                ret = bytes('HTTP/1.1 200 OK\n' + "Content-Type: text/css\n\n", 'utf-8') + content
            elif filetype == "js":
                with open(resource, 'rb') as f:
                    content = f.read()
                ret = bytes('HTTP/1.1 200 OK\n' + "Content-Type: text/javascript\n\n", 'utf-8') + content
        return ret

    def post_request(self, resource):
        content = resource.split('&')
        name = content[0].split('=')[1].replace('+', ' ')
        category = content[1].split('=')[1]
        location = content[2].split('=')[1].replace('+', ' ').replace("%2C", ',')
        contInfo = content[3].split('=')[1].replace('+', ' ')
        email = content[4].split('=')[1].replace("%40", '@').replace("%2E", '.')
        website = content[5].split('=')[1].replace("%2E", '.').replace("%3A", ':').replace("%2F", '/')
        html = "<!DOCTYPE html><html><head><meta charset='utf-8'><title>Myform</title></head><style>table{border: 1px solid black;border-collapse:collapse;}table tr,td{border:1px solid black}tr:nth-child(even){background-color:gray;}</style> <body> <table><tr><td>Name</td><td>" + name + "</td></tr><tr><td>Category</td><td>" + category + "</td></tr><tr><td>Location</td><td>" + location + "</td></tr><tr><td>Contact Information</td><td>" + contInfo + "</td></tr><tr><td>Email</td><td>" + email + "</td></tr><tr><td>Website</td><td>" + website + "</td></tr> </table></body></html>"
        return bytes('HTTP/1.1 200 OK\n\n' + html, 'utf-8')


def parse_args():
    parser = ArgumentParser()
    parser.add_argument('--host', type=str, default='localhost',
                        help='specify a host to operate on (default: localhost)')
    parser.add_argument('-p', '--port', type=int, default=9001,
                        help='specify a port to operate on (default: 9001)')
    args = parser.parse_args()
    return (args.host, args.port)


if __name__ == '__main__':
    (host, port) = parse_args()
    HTTP_HeadServer(host, port)
