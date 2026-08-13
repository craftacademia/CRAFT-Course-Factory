path = '/Users/debraj/projects/craft-course-factory 2.0 copy/src/providers/presentation/presentationProvider.js'

with open(path) as f:
    content = f.read()

old = """                const audio =
                    audioAssets.find(
                        item => {

                            const filename =
                                item.name
                                ?.toLowerCase()
                                ?? "";


                            return (
                                filename.includes(
                                    voiceId
                                    .toLowerCase()
                                    .replace("_","-")
                                )
                                ||
                                filename.startsWith(
                                    "vo-" +
                                    screenId
                                )
                            );

                        }
                    );"""

new = """                const normalizedVoiceId =
                    voiceId
                    .toLowerCase()
                    .replace("_", "-");

                const audio =
                    audioAssets.find(
                        item => {

                            const filename =
                                item.name
                                ?.toLowerCase()
                                ?? "";


                            return filename.includes(
                                normalizedVoiceId
                            );

                        }
                    );"""

count = content.count(old)
assert count == 1, f'anchor not found or not unique — count: {count}'
content = content.replace(old, new)

with open(path, 'w') as f:
    f.write(content)

print('Done')
