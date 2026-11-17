"""Coloca senha (AES-256) no currículo publicado no site.

Uso (a senha vem da variável de ambiente, para não ficar no histórico do terminal):

    PowerShell:  $env:CURRICULO_SENHA = "..."; uv run --with "pypdf[crypto]" scripts/proteger-curriculo.py curriculo-exportado.pdf
    Bash:        CURRICULO_SENHA="..." uv run --with "pypdf[crypto]" scripts/proteger-curriculo.py curriculo-exportado.pdf

Gera public/curriculo-munir-bisteni.pdf. O PDF abre normalmente com a senha;
sem ela, não abre. Mantenha o original sem senha fora da pasta public/.
"""
import os
import sys
from pathlib import Path

from pypdf import PdfReader, PdfWriter

DESTINO = Path(__file__).resolve().parent.parent / "public" / "curriculo-munir-bisteni.pdf"


def main() -> None:
    if len(sys.argv) != 2:
        sys.exit("Uso: proteger-curriculo.py <curriculo-sem-senha.pdf>")
    senha = os.environ.get("CURRICULO_SENHA")
    if not senha:
        sys.exit("Defina a variável de ambiente CURRICULO_SENHA.")

    origem = Path(sys.argv[1]).resolve()
    if origem == DESTINO:
        sys.exit("Use o PDF original (sem senha) como entrada, não o que está em public/.")

    leitor = PdfReader(origem)
    if leitor.is_encrypted:
        sys.exit("Esse PDF já tem senha. Use o original exportado do Google Docs.")

    escritor = PdfWriter(clone_from=leitor)
    escritor.encrypt(user_password=senha, owner_password=None, algorithm="AES-256")
    with open(DESTINO, "wb") as arquivo:
        escritor.write(arquivo)
    print(f"Currículo protegido salvo em {DESTINO}")


if __name__ == "__main__":
    main()
