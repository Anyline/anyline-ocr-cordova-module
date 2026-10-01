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

    # The bundle lives inside Anyline.framework, which Xcode embeds from Swift Package Manager and
    # signs with tasks of its own that are not ordered against this phase. In a clean build, an
    # archive included, it is signed BEFORE this phase runs, so the removals above leave the
    # framework's seal listing files that are no longer there: `codesign --verify` on the framework
    # answers "a sealed resource is missing or invalid". Exporting an archive re-signs nested code,
    # which hides that in an exported .ipa, but the archive itself and a build installed straight
    # from Xcode keep the broken seal. So re-sign the framework the way Xcode signs it when it
    # embeds it: the identity Xcode resolved, the flags of Xcode's own command, and
    # OTHER_CODE_SIGN_FLAGS, which Xcode passes to that command too. Nothing is signed when the
    # build signs nothing (CODE_SIGNING_ALLOWED is not YES, or there is no identity). A bundle that
    # is not inside a framework is sealed by the app's own signature, which Xcode writes after
    # every build phase.
    FRAMEWORK_PATH=$(dirname "${MODULES_DIR_PATH}")
    case "${FRAMEWORK_PATH}" in
        *.framework)
            if [ "${CODE_SIGNING_ALLOWED}" = "YES" ] && [ -n "${EXPANDED_CODE_SIGN_IDENTITY}" ]; then
                echo "Re-signing ${FRAMEWORK_PATH##*/} as ${EXPANDED_CODE_SIGN_IDENTITY_NAME:-${EXPANDED_CODE_SIGN_IDENTITY}}"
                set -- /usr/bin/codesign --force --sign "${EXPANDED_CODE_SIGN_IDENTITY}" ${OTHER_CODE_SIGN_FLAGS} \
                    --preserve-metadata=identifier,entitlements,flags --generate-entitlement-der "${FRAMEWORK_PATH}"
                echo "$*"
                "$@" || exit $?
            else
                echo "Not re-signing ${FRAMEWORK_PATH##*/}: code signing is off for this build"
            fi
            ;;
    esac
fi