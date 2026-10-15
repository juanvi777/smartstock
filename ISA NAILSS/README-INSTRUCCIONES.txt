ISA NAILS — PAQUETE DE ACTUALIZACIÓN

Este paquete prepara una identidad visual diferente para el repositorio:
https://github.com/juanvi777/isa-nailss

DIRECCIÓN VISUAL
- Verde bosque profundo (#182C2B), marfil (#F5F3ED) y dorado champán (#D5B77C).
- Manrope para interfaz y Playfair Display para títulos.
- Diseño editorial y geométrico; no replica el rosa/blush de Suldery Nails.
- Monograma IN propio e iconos nuevos de PWA.

FUNCIONALIDAD QUE SE BUSCA CONSERVAR
Registro/login, panel de clienta, panel de dueña, calendario, selección de hora y servicio, confirmación de citas, horarios, bloqueo de fechas, galería, modo oscuro y opción de instalar la app.

CÓMO APLICARLO
1. Descarga el repositorio isa-nailss desde GitHub en tu computadora.
2. Extrae este ZIP en una carpeta temporal.
3. Abre PowerShell en la carpeta raíz del repositorio clonado, donde están package.json y la carpeta public.
4. Copia APLICAR-ISA-NAILS.ps1 a esa carpeta raíz y ejecútalo:
   Set-ExecutionPolicy -Scope Process Bypass
   .\APLICAR-ISA-NAILS.ps1
5. Revisa los cambios con:
   git diff --check
   git diff
6. Prueba localmente con npm install y npm start.
7. Si funciona, guarda los cambios:
   git add -A
   git commit -m "feat: create Isa Nails visual identity"
   git push origin main

IMPORTANTE
- GitHub bloqueó desde esta sesión el permiso de escritura de la integración; el paquete NO se ha publicado y no modifica la rama main por sí solo.
- No reutilices credenciales de MySQL/JWT de otro proyecto. Comprueba .env, conexión MySQL y variables de Railway para Isa Nails.
- El contacto telefónico de Isa debe confirmarse; el paquete no inventa un número.
- Después del cambio hay que probar reservas, autenticación, galería y PWA. Las imágenes viejas de Suldery pueden permanecer guardadas como archivos sin usarse en la interfaz.
