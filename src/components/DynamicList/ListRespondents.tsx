
const ListRespondents = () => {
    const { t } = useTranslation();
    const { data: respondents, isLoading } = useGetRespondentsQuery();
    
    if (isLoading) {
        return <Loading />;
    }
    
    if (!respondents || respondents.length === 0) {
        return <EmptyState />;
    }
    
    return (
        <div>
        <h2>{t('respondents.title')}</h2>
        <ul>
            {respondents.map((respondent) => (
            <li key={respondent.id}>{respondent.name}</li>
            ))}
        </ul>
        </div>
    );
    }

export default ListRespondents;