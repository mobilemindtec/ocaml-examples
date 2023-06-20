
#!/bin/bash

############
# Usage
# Pass a path to watch, a file filter, and a command to run when those files are updated
#
# Example:
# watch.sh "node_modules/everest-*/src/templates" "*.handlebars" "ynpm compile-templates"
############

watch() {
    WORKING_PATH=$(pwd)
    EXEC="_build/default/bin/main.exe"
    DIR="bin"
    FILTER="main.ml"
    COMMAND="dune build"
    chsum1=""

    while true
    do
        chsum2=$(find -L $WORKING_PATH/$DIR -type f -name "$FILTER" -exec md5sum {} \;)
        if [ "$chsum1" != "$chsum2" ] ; then
            echo "Found a file change, executing $COMMAND..."
            clear
            $COMMAND
            $EXEC
            chsum1=$chsum2
            echo ":::::::::::::::::::::::::::::::::::::::::::::::::::::::"
            
        fi
        sleep 2
    done
}

watch "$@"
