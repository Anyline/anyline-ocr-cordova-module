#!/bin/sh
# --Available Modules--
DIR_DOCUMENT="module_document"
DIR_OCR="module_anyline_ocr"
DIR_BARCODE="module_barcode"
DIR_ENERGY="module_energy"
DIR_ID="module_id"
DIR_LICENSE_PLATE="module_license_plate"
DIR_TIRE="module_tire"

MODULES_TO_KEEP_ARRAY=(${ANYLINE_RETAIN_ASSETS_PATTERN})
echo "Modules to include: ${MODULES_TO_KEEP_ARRAY[@]}"

FILENAME="AnylineResources.bundle"
MODULES_DIR_PATH=$(find "${CODESIGNING_FOLDER_PATH}" -iname ${FILENAME})

MODULES_ARRAY=(${DIR_OCR} ${DIR_BARCODE} ${DIR_DOCUMENT} ${DIR_ENERGY} ${DIR_ID} ${DIR_LICENSE_PLATE} ${DIR_TIRE})

if ((${#MODULES_TO_KEEP_ARRAY[@]})); then
    for module in "${MODULES_ARRAY[@]}"; do
        if [[ ! " ${MODULES_TO_KEEP_ARRAY[*]} " =~ " ${module} " ]]; then
            echo "Removing module ${module}"
            rm -rf "${MODULES_DIR_PATH}/${module}"
        fi
    done
fi