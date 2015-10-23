VAGRANTFILE_API_VERSION = "2"
VAGRANT_BOX = "puppetlabs/ubuntu-14.04-64-puppet"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = VAGRANT_BOX
  config.vm.box_url = VAGRANT_BOX
  config.vm.box_version = "1.0.2"

  config.vm.network "public_network", auto_config: true
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 3001, host: 3001
  config.vm.network "forwarded_port", guest: 8080, host: 8080
  config.vm.network "forwarded_port", guest: 2992, host: 2992

  config.vm.hostname = "devbox"

  config.vm.provider :virtualbox do |vb|
    # This allows symlinks to be created within the /vagrant dir
    vb.customize ["setextradata", :id,
                  "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
    #vb.gui = true
  end

  config.vm.provision :shell, :path => "shell/librarian-puppet.sh"

  # provision with Puppet stand alone
  config.vm.provision "puppet" do |puppet|
    puppet.module_path = "environments/puppet/modules"
    puppet.environment_path = "environments"
    puppet.environment = "puppet"
    #puppet.manifests_path = "puppet/environment/manifests"
    #puppet.manifest_file = "default.pp"
    puppet.options =  ['--verbose']
  end
end
