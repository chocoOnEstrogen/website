---
title: How to Setup Vim for Better Development on Arch Linux
description: A step-by-step guide to transforming Vim into a powerful and modern text editor with plugins, themes, and essential configurations for Arch Linux users.
category: Linux,Arch,Development
date: 2024-11-16
featured: true
order: 1
toc: true
---

## Introduction

Vim is a lightweight yet powerful text editor that can be customized to rival modern IDEs. If you're an Arch Linux user, this guide will help you set up Vim with plugins, themes, and essential configurations to boost your development workflow.  

For users on Fedora, Ubuntu, or NixOS, check out the `<details>` sections for specific commands.

---

## Prerequisites

### Install Vim or Neovim
On Arch Linux, install Vim or Neovim using `pacman`:
```bash
sudo pacman -S vim
# For Neovim (optional)
sudo pacman -S neovim
```

<details> <summary>Instructions for other distributions</summary>

### Fedora

```bash
sudo dnf install vim
sudo dnf install neovim # For Neovim
```

### Ubuntu

```bash
sudo apt update
sudo apt install vim
sudo apt install neovim # For Neovim
```

### NixOS

Add Vim or Neovim to your `configuration.nix`:

```nix
environment.systemPackages = with pkgs; [
  vim
  neovim
];
```

Rebuild the configuration:

```bash
sudo nixos-rebuild switch
```

</details>

### Install vim-plug (Plugin Manager)

Install vim-plug to manage your plugins. Use the following command:

```bash
curl -fLo ~/.vim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

<details> <summary>Optional: Install vim-plug for Neovim</summary>

For Neovim, place `plug.vim` in Neovim's config directory:

```bash
curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
```

</details>

## Step 1: Create a Fully Featured vimrc

Save the following configuration to `~/.vimrc`:

```vim
" Enable vim-plug for plugin management
call plug#begin('~/.vim/plugged')

" Theme and appearance
Plug 'sainnhe/everforest'

" Language support
Plug 'sheerun/vim-polyglot'          " Multi-language syntax support
Plug 'HerringtonDarkholme/yats.vim'  " TypeScript/JavaScript/TSX
Plug 'rust-lang/rust.vim'            " Rust support
Plug 'vim-python/python-syntax'      " Python support
Plug 'Shirk/vim-gas'                 " Assembly syntax support

" Productivity plugins
Plug 'preservim/nerdtree'            " File explorer
Plug 'junegunn/fzf', { 'do': { -> fzf#install() }} " Fuzzy finder
Plug 'tpope/vim-commentary'          " Commenting utility
Plug 'airblade/vim-gitgutter'        " Git diff in gutter

call plug#end()

" Theme settings
set background=dark
let g:everforest_background = 'soft'
colorscheme everforest

" Essential settings
syntax on
set number
set relativenumber
set tabstop=4
set shiftwidth=4
set expandtab
set clipboard=unnamedplus

" NERDTree toggle
map <C-n> :NERDTreeToggle<CR>

" FZF key binding
nnoremap <C-p> :FZF<CR>
```

Once saved, open Vim and run `:PlugInstall` to install the plugins.

# Step 2: Install Fonts for Icons and Themes

Themes like Everforest and plugins like NERDTree benefit from using a **Nerd Font**.

1. Install a Nerd Font package from the AUR, for example:

```bash
yay -S nerd-fonts-fira-code
```

2. Set the font in your terminal emulator.

<details> <summary>Instructions for other distributions</summary>

### Fedora

```bash
sudo dnf install fira-code-fonts
```

### Ubuntu

Download and install a Nerd Font manually:

```bash
wget https://github.com/ryanoasis/nerd-fonts/releases/download/v2.3.3/FiraCode.zip
unzip FiraCode.zip -d ~/.fonts
fc-cache -fv
```

</details>


# Step 3: Enhance Programming Experience

## Add ALE for Linting

Add ALE to your plugins for real-time linting:

```vim
Plug 'dense-analysis/ale'
```

Configure ALE for specific languages:

```vim
let g:ale_linters = {
\   'javascript': ['eslint'],
\   'python': ['flake8'],
\   'rust': ['cargo'],
\}
```

## Install coc.nvim for Autocomplete

```vim
Plug 'neoclide/coc.nvim', {'branch': 'release'}
```

Run `:CocInstall` to add language server support.

# Conclusion

With this setup, Vim is no longer just a text editor; it's a fully featured development environment. Whether you're coding in Rust, Python, or JavaScript, or simply editing files, your workflow will be faster and more enjoyable.
