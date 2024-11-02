import { marked } from 'marked'

export function getFileExtension(filename: string): string {
	return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

export function getLanguageFromExtension(extension: string): string {
	const languageMap: { [key: string]: string } = {
		// JavaScript and related
		js: 'javascript',
		mjs: 'javascript',
		cjs: 'javascript',
		jsx: 'jsx',

		// TypeScript
		ts: 'typescript',
		tsx: 'typescript',

		// Python
		py: 'python',
		pyw: 'python',

		// Ruby
		rb: 'ruby',

		// Java
		java: 'java',
		class: 'java',

		// Kotlin
		kt: 'kotlin',
		kts: 'kotlin',

		// C/C++ and headers
		c: 'c',
		h: 'cpp',
		cc: 'cpp',
		cpp: 'cpp',
		cxx: 'cpp',
		hpp: 'cpp',
		hh: 'cpp',

		// C#
		cs: 'csharp',

		// F#
		fs: 'fsharp',
		fsi: 'fsharp',

		// Go
		go: 'go',

		// Rust
		rs: 'rust',

		// PHP
		php: 'php',
		phtml: 'php',

		// Web technologies
		html: 'html',
		htm: 'html',
		xhtml: 'html',
		haml: 'haml',
		css: 'css',
		scss: 'scss',
		sass: 'scss',
		less: 'less',

		// Markdown and related
		md: 'markdown',
		markdown: 'markdown',
		mdx: 'markdown',

		// JSON and YAML
		json: 'json',
		yaml: 'yaml',
		yml: 'yaml',

		// XML and derivatives
		xml: 'xml',
		svg: 'xml',

		// Shell and scripts
		sh: 'bash',
		bash: 'bash',
		zsh: 'bash',
		ksh: 'bash',
		bat: 'batch',
		cmd: 'batch',

		// SQL and database files
		sql: 'sql',
		db: 'sql',

		// R and related
		r: 'r',
		rmd: 'r',

		// Powershell
		ps1: 'powershell',

		// Visual Basic
		vb: 'vbnet',
		vbs: 'vbnet',

		// Lua
		lua: 'lua',

		// Perl
		pl: 'perl',
		pm: 'perl',

		// CoffeeScript
		coffee: 'coffeescript',

		// Scala
		scala: 'scala',

		// Swift
		swift: 'swift',

		// Configuration files
		env: 'dotenv',
		toml: 'toml',
		ini: 'ini',
		cfg: 'ini',
		properties: 'ini',

		// Vim
		vim: 'vim',

		// Haskell
		hs: 'haskell',

		// Erlang
		erl: 'erlang',
		hrl: 'erlang',

		// Elixir
		ex: 'elixir',
		exs: 'elixir',

		// Zig
		zig: 'zig',

		// Docker and related
		dockerfile: 'dockerfile',
		dockerignore: 'dockerfile',

		// Makefiles and build tools
		makefile: 'makefile',
		mk: 'makefile',
		gnumakefile: 'makefile',

		// Nginx and Apache
		nginx: 'nginx',
		conf: 'nginx',

		// Text files
		txt: 'text',
		log: 'text',

		// Miscellaneous
		rst: 'restructuredtext',
		asciidoc: 'asciidoc',
		adoc: 'asciidoc',
		// Add more mappings as needed
	}

	return languageMap[extension.toLowerCase()] || 'text'
}

export function processMarkdownLinks(
	markdownContent: string,
	projectName: string,
	branch: string,
): string {
	// Process relative links only
	const processedContent = markdownContent.replace(
		/(\[.*?\])\((\.?\/?)((?!\/\/|https?:\/\/|mailto:|tel:).*?)\)/g,
		(_, linkText, slashes, path) => {
			const cleanPath = path.replace(/^\.?\//, '')
			return `${linkText}(/projects/${projectName}/${branch}/~/${cleanPath})`
		},
	)

	// Use marked.parse() for synchronous rendering
	return marked.parse(processedContent, { async: false }) as string
}
