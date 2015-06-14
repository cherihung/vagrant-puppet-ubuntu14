VAGRANTFILE_API_VERSION = "2"
VAGRANT_BOX = "puppetlabs/ubuntu-12.04-64-puppet"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = VAGRANT_BOX
  config.vm.box_url = VAGRANT_BOX

  config.vm.network :private_network,  ip: "172.22.22.22"
  config.vm.network :forwarded_port, guest: 3000, host: 3333
  config.vm.network :forwarded_port, guest: 27017, host: 2000
  config.vm.hostname = "devbox"

  #config.vm.synced_folder "./", "/var/www", id: "vagrant-root"

  config.vm.provider :virtualbox do |vb|
    # This allows symlinks to be created within the /vagrant dir
    vb.customize ["setextradata", :id,
                  "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.provision :shell, :path => "shell/librarian-puppet.sh"

  # provision with Puppet stand alone
  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = "puppet/manifests"
    puppet.manifest_file = "default.pp"
    puppet.options =  ['--verbose']
  end
end
