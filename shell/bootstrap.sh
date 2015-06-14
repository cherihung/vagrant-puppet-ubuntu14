#!/bin/sh

# Do the initial apt-get update
echo "Initial apt-get update..."
apt-get update >/dev/null

# Install wget if we have to (some older Ubuntu versions)
echo "Installing wget..."
apt-get install -y wget >/dev/null

# Check the received options in order to set up some variables
PREFER_PACKAGE=1
while getopts ":g" opt; do
  case $opt in
    g)
      echo "Using the gem installer"
      PREFER_PACKAGE=0
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done

$(which git > /dev/null 2>&1)
FOUND_GIT=$?
$(which apt-get > /dev/null 2>&1)
FOUND_APT=$?

if [ "${FOUND_APT}" -eq '0' ]; then
  apt-get -q -y update
  # Make sure Git is installed
  if [ "$FOUND_GIT" -ne '0' ]; then
    echo 'Attempting to install Git.'
    apt-get -q -y install git
    echo 'Git installed.'
  fi
fi

#!/bin/bash 
mkdir -p /etc/puppet/modules; 
if [ ! -d /etc/puppet/modules/nodejs ]; then 
  puppet module install puppetlabs-nodejs
fi

# if [ ! -d /etc/puppet/modules/apt ]; then 
# puppet module install puppetlabs-apt
# fi

# if [ ! -d /etc/puppet/modules/stdlib ]; then 
# puppet module install puppetlabs-stdlib
# fi


